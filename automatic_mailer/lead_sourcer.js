/**
 * lead_sourcer.js
 * Automatically sources relevant Frontend / React.js / UI Developer leads
 * for Hyderabad, Bangalore, and Chennai into pending_leads.json.
 * 
 * Rules:
 * - Deduplicates against sent_history.json and existing pending_leads.json
 * - Groups multiple company emails: primary -> To, secondary -> CC
 * - Strictly matches Jyoshna's authentic profile (~2 yrs exp, React, Electron, PastryChef ERP)
 * - Zero checkmarks, no emojis, clean hyphen bullets
 */

const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const PENDING_FILE = path.join(__dirname, "pending_leads.json");
const HISTORY_FILE = path.join(__dirname, "sent_history.json");
const CSV_FILE = path.join(__dirname, "companies_email_leads.csv");

const CONFIG = {
  candidateName: "Jyoshna Rayadurgam",
  senderEmail: process.env.SENDER_EMAIL || process.env.EMAIL_USER || "rayadurgamjyoshnaroyal@gmail.com",
  senderPhone: "+91 8142039969",
  linkedinUrl: "https://linkedin.com/in/jyoshna-rayadurgam",
  resumePath: path.join(__dirname, "Jyoshna_Rayadurgam_Frontend_Developer.pdf"),
};

function loadJson(filePath, defaultVal = []) {
  if (!fs.existsSync(filePath)) return defaultVal;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (e) {
    return defaultVal;
  }
}

function saveJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

function getSentEmails() {
  const history = loadJson(HISTORY_FILE, []);
  const emails = new Set();
  for (const item of history) {
    if (item.recipientEmail) emails.add(item.recipientEmail.toLowerCase().trim());
    if (item.cc) {
      item.cc.split(",").forEach(c => emails.add(c.toLowerCase().trim()));
    }
  }
  return emails;
}

function getQueuedEmails() {
  const pending = loadJson(PENDING_FILE, []);
  const emails = new Set();
  for (const item of pending) {
    if (item.to) emails.add(item.to.toLowerCase().trim());
    if (item.cc) {
      item.cc.split(",").forEach(c => emails.add(c.toLowerCase().trim()));
    }
  }
  return emails;
}

function generateEmailDraft(company, role, location = "Hyderabad / Bangalore") {
  const appliedRole = role || "Frontend Developer (React.js)";
  const subject = `Application for ${appliedRole} - Jyoshna Rayadurgam`;

  const plainText = `Dear Hiring Team at ${company},

I hope you are doing well.

My name is Jyoshna Rayadurgam, and I am a Frontend Developer with nearly 2 years of professional experience building responsive web and desktop applications using React.js and modern JavaScript, actively seeking opportunities in ${location}.

I am reaching out to explore Frontend / UI Developer openings at ${company}. Having delivered client-facing software in high-reliability environments, I am confident I can contribute effectively to your development team.

A quick summary of my experience:
- Core stack: React.js, TypeScript, JavaScript, Electron.js, Tailwind CSS, Bootstrap, and REST APIs.
- Built offline-first POS billing systems (PastryChef ERP) using React and Electron.js, with local-to-server data sync, cashier workflows, and tax calculation modules across client retail outlets.
- Developed administration portals, role-based dashboards, and live examination platforms (ETC Mentors) with REST API integrations.
- Prior professional experience at Accenture with strong client communication and technical troubleshooting skills.
- Immediate joiner based in Hyderabad, open to relocation.

Please find my resume attached for your review.

LinkedIn: ${CONFIG.linkedinUrl}

Thank you for your time and consideration. I would welcome the opportunity to discuss how my background aligns with your team's needs.

Best regards,

Jyoshna Rayadurgam
Email: ${CONFIG.senderEmail}
Mobile: ${CONFIG.senderPhone}`;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #222222; line-height: 1.6; font-size: 14px; margin: 0; padding: 0; }
    p { margin: 0 0 12px 0; }
    ul { margin: 0 0 14px 0; padding-left: 20px; }
    li { margin-bottom: 6px; }
    a { color: #0066cc; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .sign { margin-top: 18px; line-height: 1.5; color: #333333; }
  </style>
</head>
<body>
  <p>Dear Hiring Team at ${company},</p>

  <p>I hope you are doing well.</p>

  <p>My name is <strong>Jyoshna Rayadurgam</strong>, and I am a Frontend Developer with nearly 2 years of professional experience building responsive web and desktop applications using React.js and modern JavaScript, actively seeking opportunities in ${location}.</p>

  <p>I am reaching out to explore Frontend / UI Developer openings at <strong>${company}</strong>. Having delivered client-facing software in high-reliability environments, I am confident I can contribute effectively to your development team.</p>

  <p><strong>A quick summary of my experience:</strong></p>
  <ul>
    <li>Core stack: React.js, TypeScript, JavaScript, Electron.js, Tailwind CSS, Bootstrap, and REST APIs.</li>
    <li>Built offline-first POS billing systems (PastryChef ERP) using React and Electron.js, with local-to-server data sync, cashier workflows, and tax calculation modules across client retail outlets.</li>
    <li>Developed administration portals, role-based dashboards, and live examination platforms (ETC Mentors) with REST API integrations.</li>
    <li>Prior professional experience at Accenture with strong client communication and technical troubleshooting skills.</li>
    <li>Immediate joiner based in Hyderabad, open to relocation.</li>
  </ul>

  <p>Please find my resume attached for your review.</p>

  <p>LinkedIn: <a href="${CONFIG.linkedinUrl}">${CONFIG.linkedinUrl}</a></p>

  <p>Thank you for your time and consideration. I would welcome the opportunity to discuss how my background aligns with your team's needs.</p>

  <div class="sign">
    <p>Best regards,<br>
    <strong>Jyoshna Rayadurgam</strong><br>
    Email: ${CONFIG.senderEmail}<br>
    Mobile: ${CONFIG.senderPhone}</p>
  </div>
</body>
</html>`;

  return { subject, plainText, html };
}

/**
 * Loads company leads pool from CSV, grouped by company for CC handling
 */
function loadSourcedPool() {
  if (!fs.existsSync(CSV_FILE)) return [];
  const lines = fs.readFileSync(CSV_FILE, "utf-8").split("\n");
  const companyMap = new Map();

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = line.split(",");
    const company = parts[0].trim();
    const email = parts[1] ? parts[1].trim() : "";
    const careerUrl = parts[2] ? parts[2].trim() : "";
    const isHydHub = parts[4] ? parts[4].trim() === "True" : false;

    if (!company || !email || !email.includes("@")) continue;

    if (!companyMap.has(company)) {
      companyMap.set(company, {
        company,
        emails: [],
        careerUrl,
        location: isHydHub ? "Hyderabad" : "Hyderabad / Bangalore / Chennai",
      });
    }
    const entry = companyMap.get(company);
    if (!entry.emails.includes(email.toLowerCase())) {
      entry.emails.push(email.toLowerCase());
    }
  }

  return Array.from(companyMap.values());
}

/**
 * Slices up to maxBatch fresh leads and appends them to pending_leads.json
 */
function sourceFreshLeads(maxBatch = 8) {
  const sentEmails = getSentEmails();
  const queuedEmails = getQueuedEmails();
  const pool = loadSourcedPool();
  const currentPending = loadJson(PENDING_FILE, []);

  const newlyAdded = [];

  for (const item of pool) {
    if (newlyAdded.length >= maxBatch) break;

    // Check if any of this company's emails were sent or queued
    const alreadyContacted = item.emails.some(e => sentEmails.has(e) || queuedEmails.has(e));
    if (alreadyContacted) continue;

    // Separate primary To and CC
    const toEmail = item.emails[0];
    const ccEmail = item.emails.length > 1 ? item.emails.slice(1).join(",") : null;

    const draft = generateEmailDraft(item.company, "Frontend Developer (React.js)", item.location);

    const leadObject = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      sourcedAt: new Date().toISOString(),
      company: item.company,
      role: "Frontend Developer (React.js)",
      location: item.location,
      to: toEmail,
      cc: ccEmail,
      careerUrl: item.careerUrl,
      subject: draft.subject,
      plainText: draft.plainText,
      html: draft.html,
      status: "PENDING_REVIEW",
    };

    newlyAdded.push(leadObject);
    queuedEmails.add(toEmail);
    if (ccEmail) {
      ccEmail.split(",").forEach(c => queuedEmails.add(c.trim()));
    }
  }

  if (newlyAdded.length > 0) {
    const updated = [...currentPending, ...newlyAdded];
    saveJson(PENDING_FILE, updated);
  }

  return {
    addedCount: newlyAdded.length,
    totalPending: currentPending.length + newlyAdded.length,
    newLeads: newlyAdded,
  };
}

// CLI Execution
if (require.main === module) {
  const max = parseInt(process.argv[2], 10) || 8;
  console.log(`🔍 Sourcing fresh Frontend Developer leads (Max: ${max})...`);
  const result = sourceFreshLeads(max);
  console.log(`✅ Sourced ${result.addedCount} new leads.`);
  console.log(`📋 Total in queue (pending_leads.json): ${result.totalPending}`);
  if (result.addedCount > 0) {
    console.log("\n--- Newly Added Leads ---");
    result.newLeads.forEach((lead, i) => {
      console.log(`${i + 1}. ${lead.company} | To: ${lead.to} ${lead.cc ? `| CC: ${lead.cc}` : ""} | Loc: ${lead.location}`);
    });
  }
}

module.exports = { sourceFreshLeads, generateEmailDraft, loadJson, saveJson, PENDING_FILE, HISTORY_FILE };
