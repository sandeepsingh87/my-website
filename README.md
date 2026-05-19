# Sandeep Singh — Personal Website

Static personal site for [sandeepsingh87.in](https://sandeepsingh87.in): homepage, knowledge library, and session notes on Quality Engineering.

**New to maintaining this repo?** Start with **[MAINTENANCE.md](MAINTENANCE.md)** — written for non–front-end developers.

## Project overview

| Path | Purpose |
|------|---------|
| `index.html` | Homepage — profile, experience, skills |
| `library.html` | Knowledge library UI (cards driven by `library-data.js`) |
| `library-data.js` | Catalog of all published sessions |
| `links.html` | Redirects to `library.html` |
| `sessions/` | Long-form articles and training notes |
| `sessions/_session-template.html` | Starter template for new posts |
| `assets/tokens.css` | Shared colours, fonts, spacing |
| `assets/site-chrome.css` | Shared navigation, footer, scroll button |
| `assets/home.css` | Homepage-only styles |
| `assets/library.css` | Library-only styles |
| `assets/site.js` | Theme toggle, mobile nav, reading progress |
| `assets/session-shell.css` | Header/footer for session pages |
| `scripts/add-session-shell.js` | Wraps AI-generated HTML with the session shell |
| `CONTENT_IDEAS.md` | Planned posts not yet published |
| `sitemap.xml` / `robots.txt` | Search engines |
| `Archive/` | Older page versions |

## Quick start

1. Open `index.html` in a browser (double-click or “Open with Live Server” in VS Code/Cursor).
2. To add a post: follow **[MAINTENANCE.md](MAINTENANCE.md)** → “Publish a new session”.

## Deploy

Push to GitHub; the site is served via Cloudflare Pages (see the hosting tutorial in `sessions/website-hosting-tutorial.html`).
