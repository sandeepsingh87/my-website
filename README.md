# Sandeep Singh — Personal Website

This repository contains the source for a static personal website created by Sandeep Singh. The site is built with plain HTML, CSS, and JavaScript, and includes a home page, the QE Playbook, a Testing Lab demo app, and useful links/resources.

Live site: [sandeepsingh87.in](https://sandeepsingh87.in/)

## Project overview

- `index.html` — personal landing page for Sandeep Singh, featuring a professional profile, experience highlights, and navigation to other site sections.
- `library.html` — QE Playbook page that displays session notes, training material, and learning resources using `library-data.js`.
- `links.html` — redirect page that sends visitors to `library.html`.
- `library-data.js` — data source for the QE Playbook catalog, including session metadata, descriptions, tags, and file links.
- `testing-lab/` — Vite + React demo app for hands-on QE practice (published as static files).
- `assets/analytics.js` — shared analytics layer (Cloudflare Web Analytics, Microsoft Clarity, optional GA4).
- `assets/site.js` — shared JavaScript for theme switching, mobile navigation, scroll-to-top, table of contents highlighting, copy buttons, and reading progress.
- `assets/session-shell.css` — reusable shell styles for generated session pages.
- `scripts/add-session-shell.js` — helper script that adds the shared header, footer, reading progress bar, and site JavaScript to generated session HTML files.
- `sitemap.xml`, `robots.txt`, `manifest.json`, `favicon.svg` — SEO and PWA basics.
- `blog/` — directory reserved for future blog content (currently unused).
- `sessions/` — directory containing session and training note pages.
- `sessions/_session-template.html` — starter template for new session pages.
- `sessions/planned-entries.md` — draft ideas for future Playbook entries.
- `Archive/` — archived site pages and content (excluded from crawlers via `robots.txt`).

## Goals

- Create a personal website to showcase experience in Quality Engineering, end-to-end testing, and training resources.
- Build a clean, responsive static site with easy navigation and a polished design.
- Maintain a growing QE Playbook of resources, notes, and session material.

## How to use

1. Open `index.html` in a browser to view the homepage.
2. Open `library.html` to explore the QE Playbook and session notes.
3. Open `testing-lab/` to try the interactive QE demo app.
4. Update `library-data.js` to add new Playbook entries and link them to pages in `sessions/`.

## Adding a new session page

Best option:

1. Copy `sessions/_session-template.html` to a new file in `sessions/`.
2. Replace the title, metadata, and main content.
3. Add the new page metadata to `library-data.js`.

If a page is generated outside the repo by an AI tool or written manually as a full HTML file, place it in `sessions/` and run:

```sh
# From the repo root
node scripts/add-session-shell.js sessions/new-session.html
```

If you are already inside the `sessions/` folder, run:

```sh
node ../scripts/add-session-shell.js new-session.html
```

This adds the consistent Sandeep Singh header, QE Playbook back button, shared footer, scroll-to-top button, reading progress bar, and shared site JavaScript.

## Analytics

The public site uses a single shared layer in `assets/analytics.js`. Pages load that file once. Do not paste third-party snippets into individual HTML files.

Configuration lives at the top of `assets/analytics.js` in `ANALYTICS_CONFIG`. Do not put passwords, OTPs, personal information, or user data there.

### Cloudflare Web Analytics

Primary traffic analytics: page views, visitors, URLs, referrers, and available RUM/performance data.

Configure in `assets/analytics.js`:

- `cloudflareEnabled` (default `true`)
- `cloudflareToken` — site token from Cloudflare Dashboard → Web Analytics → your site → JS snippet

Two valid setups (use only one, or you will double-count page views):

1. **Automatic (Cloudflare Pages / proxied hostname):** enable Web Analytics in the Cloudflare dashboard and leave `cloudflareToken` empty. Cloudflare can inject the beacon at the edge.
2. **Manual JS beacon:** paste the site token into `cloudflareToken`. The shared script loads `https://static.cloudflareinsights.com/beacon.min.js`.

Verify: open a public page, then check the Cloudflare Web Analytics dashboard for the hostname after a visit. In DevTools Network, look for a request to `/cdn-cgi/rum` or `cloudflareinsights.com` when the manual token is set.

### Microsoft Clarity

Behavioural analytics: session recordings, heatmaps, clicks, and scrolling.

Configure in `assets/analytics.js`:

- `clarityEnabled`
- `clarityProjectId` — Project ID from https://clarity.microsoft.com/

Recordings mask passwords, OTPs, emails, phone numbers, and money-transfer amounts (`data-clarity-mask`).

### Google Analytics 4

Optional. The site does not use Google Tag Manager.

Configure in `assets/analytics.js`:

- `googleAnalyticsEnabled`
- `googleMeasurementId` — GA4 Measurement ID (`G-…`) from Google Analytics Admin → Data streams

### How to view analytics data

Deploy the `Analytics` branch (or merge to the branch Cloudflare Pages builds) before expecting Clarity or GA4 hits.

Use a normal browser without an ad blocker when testing, then wait a few minutes (Clarity recordings can take longer the first time).

**Cloudflare Web Analytics (traffic)**

1. Open https://dash.cloudflare.com
2. Left sidebar: **Analytics** → **Web analytics**
3. Click **sandeepsingh87.in**
4. Use this for page views, visits, URLs, referrers, and performance/RUM
5. Site uses **Automatic setup** — no token in the repo

**Microsoft Clarity (behaviour)**

1. Open https://clarity.microsoft.com and sign in with the Microsoft account that owns the project
2. Open the project for `sandeepsingh87.in`
3. **Dashboard** — overview
4. **Recordings** — session playback
5. **Heatmaps** — clicks and scroll
6. Custom events (login, playbook views, lab) appear as Clarity events after people use those pages

**Google Analytics 4**

1. Open https://analytics.google.com
2. Select the property for this site
3. **Reports** → **Realtime** — confirm a visit within a few minutes
4. **Reports** → **Engagement** → **Events** — `page_view`, `playbook_article_view`, Testing Lab events
5. **Reports** → **Engagement** → **Pages and screens** — which URLs people open

**Quick test after deploy**

1. Visit https://sandeepsingh87.in/
2. Open https://sandeepsingh87.in/library.html
3. Open any page under `/sessions/`
4. Open https://sandeepsingh87.in/testing-lab/
5. Check Cloudflare (counts), GA4 Realtime (this visit), Clarity later the same day (recordings)

### Custom events

All custom events go through `window.Analytics.track(name, params)`. Pages should not call Cloudflare, Clarity, or GA4 APIs directly.

| Event | When |
| --- | --- |
| `playbook_article_view` | Once per load for pages under `sessions/`. Includes `page_title` and `page_path` only. |
| `testing_lab_view` | Testing Lab or Money Transfer Lab opens (`lab`: `qe` or `money_transfer`) |
| `testing_lab_form_view` | QE Lab Forms view |
| `login_form_view` | Auth lab login UI shown |
| `otp_login_started` | Demo OTP send succeeded (`method`: `email` or `phone` — never the identifier) |
| `login_success` | Login succeeded (`method`: `password` or `otp`) |
| `registration_started` | User begins creating a test account |
| `registration_success` | Test account or QE lab profile saved (`surface` only) |

Sensitive user-entered values are never sent: no passwords, OTPs, emails, phone numbers, card, or bank details. `Analytics.track` also drops parameter keys/values that look like those fields.

## Notes

- The site is static and does not require a server to run locally.
- The site is published via GitHub + Cloudflare Pages at `sandeepsingh87.in`.
- See `SESSION_HANDOFF.md` for detailed project context for AI-assisted editing sessions.
