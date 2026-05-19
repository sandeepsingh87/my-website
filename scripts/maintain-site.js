#!/usr/bin/env node
/**
 * One-off maintenance helpers (extract CSS, clean session pages).
 * Run from repo root: node scripts/maintain-site.js <command>
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function extractSiteCss() {
  const indexPath = path.join(ROOT, 'index.html');
  const libraryPath = path.join(ROOT, 'library.html');
  const index = fs.readFileSync(indexPath, 'utf8');
  const library = fs.readFileSync(libraryPath, 'utf8');

  const indexCss = index.match(/<style>\n([\s\S]*?)\n  <\/style>/);
  const libraryCss = library.match(/<style>\n([\s\S]*?)\n  <\/style>/);
  if (!indexCss || !libraryCss) throw new Error('Could not find <style> blocks');

  const css = indexCss[1];
  const layoutIdx = css.indexOf('/* LAYOUT */');
  const heroIdx = css.indexOf('/* HERO */');
  if (layoutIdx < 0 || heroIdx < 0) throw new Error('Could not split index CSS');

  const tokens = css.slice(0, layoutIdx).trim();
  const chrome = css.slice(layoutIdx, heroIdx).trim();
  const home = css.slice(heroIdx).trim();

  const lib = libraryCss[1];
  const libPageIdx = lib.indexOf('/* ── PAGE HERO ── */');
  if (libPageIdx < 0) throw new Error('Could not split library CSS');

  const libraryPage = lib.slice(libPageIdx).trim();

  fs.writeFileSync(path.join(ROOT, 'assets/tokens.css'), tokens + '\n');
  fs.writeFileSync(path.join(ROOT, 'assets/site-chrome.css'), chrome + '\n');
  fs.writeFileSync(path.join(ROOT, 'assets/home.css'), home + '\n');
  fs.writeFileSync(path.join(ROOT, 'assets/library.css'), libraryPage + '\n');

  const cssLinks = `  <link rel="stylesheet" href="assets/tokens.css" />
  <link rel="stylesheet" href="assets/site-chrome.css" />
`;

  const newIndex = index.replace(
    /<style>[\s\S]*?<\/style>/,
    `${cssLinks}  <link rel="stylesheet" href="assets/home.css" />`
  );
  const newLibrary = library.replace(
    /<style>[\s\S]*?<\/style>/,
    `${cssLinks}  <link rel="stylesheet" href="assets/library.css" />`
  );

  fs.writeFileSync(indexPath, newIndex);
  fs.writeFileSync(libraryPath, newLibrary);
  console.log('Extracted CSS and updated index.html + library.html');
}

function cleanupSessionFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  const hadSessionNav = html.includes('class="session-nav"');

  if (hadSessionNav && html.includes('<nav class="nav"')) {
    html = html.replace(/\s*(?:<!-- NAV -->\s*)?<nav class="nav"[\s\S]*?<\/nav>\s*/gi, '\n');
  }

  if (html.includes('class="session-progress"') && html.includes('class="progress-bar"')) {
    html = html.replace(/\s*<div class="progress-bar">[\s\S]*?<\/div>\s*(?=<div class="hero"|<main|<section)/i, '\n');
  }

  if (html.includes('class="session-footer"') && html.includes('<footer class="footer"')) {
    html = html.replace(/\s*<!-- FOOTER -->\s*<footer class="footer">[\s\S]*?<\/footer>\s*/i, '\n');
  }

  const scrollMatches = html.match(/<button class="scroll-top"[\s\S]*?<\/button>/g) || [];
  if (scrollMatches.length > 1) {
    let seen = 0;
    html = html.replace(/<button class="scroll-top"[\s\S]*?<\/button>/g, (m) => {
      seen += 1;
      return seen === scrollMatches.length ? m : '';
    });
  }

  const scriptTags = html.match(/<script src="\.\.\/assets\/site\.js"><\/script>/g) || [];
  if (scriptTags.length > 1) {
    let first = true;
    html = html.replace(/<script src="\.\.\/assets\/site\.js"><\/script>\s*/g, (m) => {
      if (first) {
        first = false;
        return m;
      }
      return '';
    });
  }

  html = html.replace(/href="\/"(?![^?]*sandeepsingh87)/g, 'href="../index.html"');

  fs.writeFileSync(filePath, html);
  console.log('Cleaned', path.relative(ROOT, filePath));
}

function cleanupAllSessions() {
  const dir = path.join(ROOT, 'sessions');
  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith('.html') || name.startsWith('_')) continue;
    cleanupSessionFile(path.join(dir, name));
  }
}

const cmd = process.argv[2];
if (cmd === 'extract-css') extractSiteCss();
else if (cmd === 'cleanup-sessions') cleanupAllSessions();
else {
  console.error('Usage: node scripts/maintain-site.js extract-css|cleanup-sessions');
  process.exit(1);
}
