/**
 * sourcer_daemon.js
 * Continuous background worker that checks and sources new leads every 2 hours.
 * 
 * Usage:
 *   node sourcer_daemon.js              (runs every 2 hours)
 *   node sourcer_daemon.js --interval 60 (runs every 60 minutes)
 */

const { sourceFreshLeads, loadJson, PENDING_FILE } = require("./lead_sourcer");

// Default interval: 2 hours (in ms)
let intervalMinutes = 120;

const intervalArgIdx = process.argv.indexOf("--interval");
if (intervalArgIdx !== -1 && process.argv[intervalArgIdx + 1]) {
  intervalMinutes = parseInt(process.argv[intervalArgIdx + 1], 10) || 120;
}

const INTERVAL_MS = intervalMinutes * 60 * 1000;

function runCycle() {
  const timeStr = new Date().toLocaleTimeString();
  console.log(`\n[${timeStr}] ⏰ Running scheduled 2-hour lead sourcing cycle...`);

  try {
    const result = sourceFreshLeads(6); // Add up to 6 fresh leads per cycle
    if (result.addedCount > 0) {
      console.log(`[${timeStr}] ✅ Added ${result.addedCount} new leads to queue.`);
      console.log(`[${timeStr}] 📥 Total leads waiting in pending_leads.json: ${result.totalPending}`);
      result.newLeads.forEach((lead) => {
        console.log(`   + ${lead.company} (${lead.role}) -> ${lead.to}`);
      });
    } else {
      console.log(`[${timeStr}] ℹ️ No new uncontacted leads found in this cycle. Current pending: ${result.totalPending}`);
    }
  } catch (err) {
    console.error(`[${timeStr}] ⚠️ Error during sourcing cycle:`, err.message);
  }

  console.log(`[${timeStr}] ⏳ Next sourcing run in ${intervalMinutes} minutes.`);
}

console.log(`===============================================================`);
console.log(`🤖 AUTOMATED 2-HOUR LEAD SOURCER DAEMON STARTED`);
console.log(`   Cycle interval: Every ${intervalMinutes} minutes`);
console.log(`   Staging file: ${PENDING_FILE}`);
console.log(`   Status: Actively monitoring and queuing uncontacted leads.`);
console.log(`===============================================================`);

// Run first cycle immediately
runCycle();

// Schedule recurring cycles
setInterval(runCycle, INTERVAL_MS);
