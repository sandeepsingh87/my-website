#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const target = process.argv[2];

if (!target) {
  console.error('Usage: node scripts/add-session-shell.js sessions/new-session.html');
  process.exit(1);
}

const filePath = path.resolve(process.cwd(), target);

if (!fs.existsSync(filePath)) {
  console.error(`File not found: ${target}`);
  process.exit(1);
}

let html = fs.readFileSync(filePath, 'utf8');

function ensureBeforeHeadClose(markup) {
  if (html.includes(markup)) return;
  html = html.replace(/<\/head>/i, `  ${markup}\n</head>`);
}

function ensureBeforeBodyClose(markup) {
  if (html.includes(markup)) return;
  html = html.replace(/<\/body>/i, `${markup}\n</body>`);
}

function ensureAfterBodyOpen(marker, markup) {
  if (html.includes(marker)) return;
  html = html.replace(/<body([^>]*)>/i, `<body$1>\n${markup}`);
}

ensureBeforeHeadClose('<link rel="stylesheet" href="../assets/session-shell.css" />');

ensureAfterBodyOpen('class="session-nav"', `  <nav class="session-nav" aria-label="Main navigation">
    <div class="session-nav__inner">
      <a href="/" class="session-nav__logo" aria-label="Sandeep Singh — Home">
        <svg class="session-nav__mark" viewBox="0 0 34 34" fill="none" aria-hidden="true">
          <rect width="34" height="34" rx="7" fill="var(--session-primary)"/>
          <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="Georgia, serif" font-size="16" fill="#fff" letter-spacing="0.5">SS</text>
        </svg>
        <span class="session-nav__name">Sandeep Singh</span>
      </a>
      <div class="session-nav__right">
        <button class="session-nav__theme" data-theme-toggle aria-label="Switch to dark mode">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>
        <a href="../library.html" class="session-nav__back">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          QE Playbook
        </a>
      </div>
    </div>
  </nav>

  <div class="session-progress" aria-label="Reading progress">
    <div class="session-progress__inner">
      <span class="session-progress__label">Reading Progress</span>
      <div class="session-progress__track">
        <div class="session-progress__fill" data-reading-progress-fill></div>
      </div>
      <span class="session-progress__label" data-reading-progress-label>0%</span>
    </div>
  </div>
`);

ensureBeforeBodyClose(`  <footer class="session-footer">
    <div class="session-footer__inner">
      <p class="session-footer__copy">&copy; 2026 Sandeep Singh. All rights reserved.</p>
      <ul class="session-footer__links">
        <li><a href="/">Home</a></li>
        <li><a href="../library.html">QE Playbook</a></li>
        <li><a href="mailto:mailsandeeps3@gmail.com">Email</a></li>
      </ul>
    </div>
  </footer>

  <button class="scroll-top" id="scroll-top" aria-label="Scroll to top">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
  </button>`);

ensureBeforeBodyClose('  <script src="../assets/site.js"></script>');

if (!html.includes('session-shell-offset')) {
  html = html.replace(/<main([^>]*)>/i, (match, attrs) => {
    if (/class="/i.test(attrs)) {
      return `<main${attrs.replace(/class="([^"]*)"/i, 'class="$1 session-shell-offset"')}>`;
    }
    return `<main${attrs} class="session-shell-offset">`;
  });
}

fs.writeFileSync(filePath, html);
console.log(`Updated ${target} with the shared session shell.`);
