# Sandeep Singh — Personal Website

This repository contains the source for a static personal website created by Sandeep Singh. The site is built with plain HTML, CSS, and JavaScript, and includes a home page, a knowledge library, and useful links/resources.

## Project overview

- `index.html` — personal landing page for Sandeep Singh, featuring a professional profile, experience highlights, and navigation to other site sections.
- `library.html` — knowledge library page that displays session notes, training material, and learning resources using `library-data.js`.
- `links.html` — redirect page that sends visitors to `library.html`.
- `library-data.js` — data source for the knowledge library, including session metadata, descriptions, tags, and file links.
- `assets/site.js` — shared JavaScript for theme switching, mobile navigation, scroll-to-top, table of contents highlighting, copy buttons, and reading progress.
- `assets/session-shell.css` — reusable shell styles for generated session pages.
- `scripts/add-session-shell.js` — helper script that adds the shared header, footer, reading progress bar, and site JavaScript to generated session HTML files.
- `blog/` — directory for blog content.
- `sessions/` — directory containing session and training note pages.
- `sessions/_session-template.html` — starter template for new session pages.
- `Archive/` — archived site pages and content.

## Goals

- Create a personal website to showcase experience in Quality Engineering, end-to-end testing, and training resources.
- Build a clean, responsive static site with easy navigation and a polished design.
- Maintain a growing library of resources, notes, and session material.

## How to use

1. Open `index.html` in a browser to view the homepage.
2. Open `library.html` to explore the knowledge library and session notes.
3. Update `library-data.js` to add new library entries and link them to pages in `sessions/`.

## Adding a new session page

Best option:

1. Copy `sessions/_session-template.html` to a new file in `sessions/`.
2. Replace the title, metadata, and main content.
3. Add the new page metadata to `library-data.js`.

If a page is generated outside the repo by an AI tool or written manually as a full HTML file, place it in `sessions/` and run:

```sh
node scripts/add-session-shell.js sessions/new-session.html
```

This adds the consistent Sandeep Singh header, `All Posts` button, shared footer, scroll-to-top button, reading progress bar, and shared site JavaScript.

## Notes

- The site is static and does not require a server to run locally.
- You can publish the content on any static hosting platform such as GitHub Pages.
