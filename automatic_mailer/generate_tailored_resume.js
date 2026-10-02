#!/usr/bin/env node

/**
 * ============================================================
 *  🎯 ATS Resume Generator for Jyoshna Rayadurgam
 * ============================================================
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const args = process.argv.slice(2);
function getArg(flag, defaultVal = "") {
  const idx = args.indexOf(flag);
  if (idx !== -1 && idx + 1 < args.length) {
    return args[idx + 1];
  }
  return defaultVal;
}

const companyName = getArg("--company", "Target Company");
const targetRole = getArg("--role", "Frontend Developer");
const outputFile = getArg("--out", "");

const safeComp = companyName.replace(/[^a-zA-Z0-9_-]/g, "_").replace(/_+/g, "_");
const outputDir = path.join(__dirname, "dist_resumes");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputPdf = outputFile || (companyName === "Target Company" 
  ? path.join(__dirname, "Jyoshna_Rayadurgam_Frontend_Developer.pdf")
  : path.join(outputDir, `Jyoshna_Rayadurgam_${safeComp}.pdf`));
const tempHtml = path.join(outputDir, `temp_${safeComp}.html`);

const PROFILE = {
  name: "JYOSHNA RAYADURGAM",
  phone: "+91 8142039969",
  email: "rayadurgamjyoshnaroyal@gmail.com",
  linkedin: "https://linkedin.com/in/jyoshna-rayadurgam",
  role: targetRole || "Frontend Developer",
  summary: "Frontend Developer with nearly 2 years of experience building React.js-based web and desktop applications for client-facing business operations. Skilled in production support, technical troubleshooting, and delivering high quality, scalable UI solutions using TypeScript, Tailwind CSS, and REST APIs. Experienced in building POS billing systems, examination management platforms, and business websites with admin panels."
};

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${PROFILE.name} Resume</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: Arial, Helvetica, sans-serif;
      color: #111827;
      line-height: 1.4;
      font-size: 11px;
      padding: 0.4in 0.5in;
      background: #ffffff;
    }
    .header { text-align: center; margin-bottom: 12px; border-bottom: 1.5px solid #1e3a8a; padding-bottom: 6px; }
    .name { font-size: 20px; font-weight: 700; color: #1e3a8a; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 3px; }
    .contact { font-size: 10.5px; color: #374151; }
    .contact a { color: #1e3a8a; text-decoration: none; }
    .section-title { font-size: 12px; font-weight: 700; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #d1d5db; padding-bottom: 2px; margin-top: 10px; margin-bottom: 6px; }
    .summary-text { color: #374151; text-align: justify; margin-bottom: 4px; }
    .skills-row { font-size: 10.5px; margin-bottom: 3px; color: #374151; }
    .skills-row strong { color: #111827; }
    .exp-item { margin-bottom: 8px; }
    .exp-header { display: flex; justify-content: space-between; font-weight: 700; font-size: 11px; color: #111827; }
    .exp-company { color: #1e3a8a; }
    .project-title { font-weight: 700; font-size: 10.5px; color: #1e3a8a; margin-top: 4px; margin-bottom: 2px; }
    ul { padding-left: 16px; margin-top: 2px; }
    li { margin-bottom: 3px; color: #374151; }
    .edu-row { display: flex; justify-content: space-between; font-size: 10.5px; color: #374151; }
  </style>
</head>
<body>

  <div class="header">
    <div class="name">${PROFILE.name}</div>
    <div class="contact">
      ${PROFILE.phone} &nbsp;|&nbsp; 
      <a href="mailto:${PROFILE.email}">${PROFILE.email}</a> &nbsp;|&nbsp; 
      <a href="${PROFILE.linkedin}">linkedin.com/in/jyoshna-rayadurgam</a>
    </div>
  </div>

  <div class="section-title">Professional Summary</div>
  <div class="summary-text">${PROFILE.summary}</div>

  <div class="section-title">Technical Skills</div>
  <div class="skills-row"><strong>Frontend:</strong> React.js, Electron.js, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS, Bootstrap</div>
  <div class="skills-row"><strong>Core Skills:</strong> REST API Integration, Responsive Design, Client-Facing Delivery, Production Troubleshooting, POS Billing Workflows, Tax & Billing Calculations, Git, GitHub, GitLab</div>

  <div class="section-title">Experience</div>

  <div class="exp-item">
    <div class="exp-header">
      <span class="exp-company">Frontend Developer | Youngminds</span>
      <span>Dec 2024 – July 2026</span>
    </div>

    <div class="project-title">PastryChef ERP</div>
    <ul>
      <li>Built UI components to handle offline/online billing workflows, including sync status indicators and error handling for local-to-server data synchronization, improving reliability for client outlets.</li>
      <li>Developed cashier modules for a native desktop offline-based ERP application used across multiple business outlets.</li>
      <li>Implemented billing workflows, tax calculations, discount distribution, payment handling, and stock-controlled product management.</li>
      <li>Delivered core billing modules — barcode scanning, customer lookup, cash handover, order cancellation — as first point of contact for client-reported issues during rollout across multiple outlets.</li>
    </ul>

    <div class="project-title">ETC Mentors Examination Platform</div>
    <ul>
      <li>Developed administration modules for student registration, college registration, exam creation, scheduling, reporting, and result management.</li>
      <li>Built role-based dashboards and workflows supporting live and scheduled examinations.</li>
    </ul>

    <div class="project-title">Business, Educational & Corporate Websites</div>
    <ul>
      <li>Developed responsive websites and admin panels using HTML, CSS, Bootstrap, Tailwind CSS, and JavaScript.</li>
      <li>Built content management features for events, galleries, faculty information, forms, and dynamic website updates.</li>
      <li>Worked extensively with REST APIs to integrate customer, billing, examination, reporting, and content management workflows.</li>
      <li>Documented technical workflows and shared implementation learnings with the team to improve delivery efficiency across modules.</li>
    </ul>

    <div style="margin-top: 4px;"><strong>Certifications:</strong> React.js Frontend Development — AchieversIT, Bangalore</div>
  </div>

  <div class="section-title">Additional Experience</div>
  <div class="exp-item">
    <div class="exp-header">
      <span class="exp-company">Business Process Associate | Accenture</span>
      <span>Aug 2023 – Nov 2024</span>
    </div>
    <div style="margin-top: 2px; color: #374151;">Prior role before transitioning into frontend development; built foundational client communication and process-driven problem-solving skills.</div>
  </div>

  <div class="section-title">Education</div>
  <div class="edu-row">
    <div><strong>B.Com (Computer Applications)</strong> | SV University</div>
    <div>CGPA: 8.60</div>
  </div>

</body>
</html>`;

fs.writeFileSync(tempHtml, htmlContent, "utf-8");

try {
  const chromeCmd = `google-chrome --headless --disable-gpu --no-sandbox --print-to-pdf="${outputPdf}" "${tempHtml}"`;
  execSync(chromeCmd, { stdio: "pipe" });

  if (fs.existsSync(outputPdf)) {
    const stats = fs.statSync(outputPdf);
    console.log(`\n✔ Resume PDF generated successfully!`);
    console.log(`  👤 Name:     ${PROFILE.name}`);
    console.log(`  📄 PDF Path: ${outputPdf}`);
    console.log(`  📦 Size:     ${(stats.size / 1024).toFixed(1)} KB`);
  }
} catch (err) {
  // If Chrome binary isn't in PATH as google-chrome (e.g. Windows), try Chrome/Edge paths
  const msedgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const browserPath = fs.existsSync(chromePath) ? chromePath : (fs.existsSync(msedgePath) ? msedgePath : "");

  if (browserPath) {
    try {
      execSync(`"${browserPath}" --headless --disable-gpu --print-to-pdf="${outputPdf}" "${tempHtml}"`, { stdio: "pipe" });
      if (fs.existsSync(outputPdf)) {
        console.log(`\n✔ Resume PDF generated successfully via browser!`);
        console.log(`  📄 PDF Path: ${outputPdf}`);
      }
    } catch (e) {
      console.error(`✖ PDF rendering error:`, e.message);
    }
  } else {
    console.log(`ℹ Saved HTML preview to: ${tempHtml}`);
  }
} finally {
  if (fs.existsSync(tempHtml)) {
    fs.unlinkSync(tempHtml);
  }
}
