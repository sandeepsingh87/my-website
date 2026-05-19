#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const target = process.argv[2];

if (!target) {
  console.error('Usage: node scripts/add-qe-repo-shell.js qe-repo/new-resource.html');
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

function stripLegacyChrome() {
  if (!html.includes('class="session-nav"')) return;

  html = html.replace(/\s*(?:<!-- NAV -->\s*)?<nav class="nav"[\s\S]*?<\/nav>\s*/gi, '\n');

  if (html.includes('class="session-progress"')) {
    html = html.replace(/\s*<div class="progress-bar">[\s\S]*?<\/div>\s*(?=<div class="hero"|<main|<section)/i, '\n');
    html = html.replace(/\s*<div class="progress-bar">[\s\S]*?<\/div>\s*(?=<div class="hero"|<main|<section)/i, '\n');
  }

  if (html.includes('class="session-footer"')) {
    html = html.replace(/\s*<!-- FOOTER -->\s*<footer class="footer">[\s\S]*?<\/footer>\s*/gi, '\n');
  }

  const scrollButtons = html.match(/<button class="scroll-top"[\s\S]*?<\/button>/g) || [];
  if (scrollButtons.length > 1) {
    let kept = false;
    html = html.replace(/<button class="scroll-top"[\s\S]*?<\/button>/g, (m) => {
      if (kept) return '';
      kept = true;
      return m;
    });
  }

  const scripts = html.match(/<script src="\.\.\/assets\/site\.js"><\/script>/g) || [];
  if (scripts.length > 1) {
    let first = true;
    html = html.replace(/<script src="\.\.\/assets\/site\.js"><\/script>\s*/g, (m) => {
      if (first) {
        first = false;
        return m;
      }
      return '';
    });
  }

  html = html.replace(/href="\/"(?![^"]*sandeepsingh87)/g, 'href="../index.html"');
}

const sessionShellMarkup = `  <nav class="session-nav" aria-label="Main navigation">
    <div class="session-nav__inner">
      <a href="../index.html" class="session-nav__logo" aria-label="Sandeep Singh — Home">
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
        <a href="../qe-repository.html" class="session-nav__back">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          QE Repository
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
`;

ensureBeforeHeadClose('<link rel="stylesheet" href="../assets/session-shell.css" />');
ensureAfterBodyOpen('class="session-nav"', sessionShellMarkup);

ensureBeforeBodyClose(`  <footer class="session-footer">
    <div class="session-footer__inner">
      <p class="session-footer__copy">&copy; 2026 Sandeep Singh. All rights reserved.</p>
      <ul class="session-footer__links">
        <li><a href="../index.html">Home</a></li>
        <li><a href="../qe-repository.html">QE Repository</a></li>
        <li><a href="../library.html">Library</a></li>
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

stripLegacyChrome();

fs.writeFileSync(filePath, html);
console.log(`Updated ${target} with the shared QE Repository shell.`);
