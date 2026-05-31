# Session Handoff — Sandeep Singh Personal Website
**Date:** 2026-05-31  
**Use this as starting context in the next AI session.**

---

## Current Project State

### Project Location
`/Users/sandeepsingh/my-website`

### Site Type
Static personal website built with plain HTML, CSS, and JavaScript.

There is no Astro/Next/build pipeline currently. A previous incomplete Astro attempt was removed. The site should be treated as a static site unless the user explicitly asks to migrate frameworks again.

### Git State
- Current branch: `main`
- Remote tracking: `origin/main`
- Latest commit: `2a4603f Rename library to QE Playbook and improve landing layout`
- Backup branch: `legacy`
- `legacy` points to older static-site state: `36c8a40 CSS Cleanup Updates`

Before making changes, always run:

```sh
git status --short --branch
git log --oneline --decorate -5
```

---

## What This Site Is

This is Sandeep Singh's personal website focused on:

- Quality Engineering leadership
- End-to-end testing
- Test automation
- Playwright and practical QE training
- AI-assisted testing exploration
- A growing searchable knowledge section now positioned as the main attraction

Primary public domain currently referenced in the site:

`https://sandeepsingh87.in/`

Key identity details used across the site:

- Name: Sandeep Singh
- Role: Manager, E2E, Quality Engineering
- Location: Pune, India
- Experience: 16+ years
- Current company mentioned: Western Union
- LinkedIn: `https://www.linkedin.com/in/sandeepsingh87/`
- Email: `mailsandeeps3@gmail.com`

---

## Current File Map

```text
/Users/sandeepsingh/my-website/
├── index.html                         # Home page / personal landing page
├── library.html                       # QE Playbook page
├── library-data.js                    # Data source for Playbook cards
├── links.html                         # Redirect/legacy links page
├── profile.webp                       # Preferred profile image
├── profile.jpg                        # Profile image fallback
├── README.md
├── SESSION_HANDOFF.md                 # This file
├── assets/
│   ├── styles.css                     # Shared design tokens, nav, footer, layout
│   ├── library.css                    # QE Playbook page styles
│   ├── session-shell.css              # Shared styles for session/article pages
│   └── site.js                        # Theme toggle, mobile nav, scroll top, TOC, copy code
├── scripts/
│   └── add-session-shell.js           # Adds shared shell to generated session HTML
├── sessions/
│   ├── _session-template.html
│   ├── README.md
│   ├── atlassian-training.html
│   ├── getting-started-with-playwright-2026.html
│   ├── website-hosting-tutorial.html
│   └── why-qe-is-not-just-testing.html
└── Archive/
    ├── index.html
    └── links.html
```

---

## Important Recent Decisions

### 1. Keep Static Site for Now
An earlier AI tool started an Astro migration by adding untracked files such as:

- `astro.config.mjs`
- `package.json`
- `src/`
- `tailwind.config.mjs`
- `tsconfig.json`

That migration was incomplete and was removed. The recommendation was to keep the current static site stable and improve it incrementally.

### 2. Rename "Library" to "QE Playbook"
The user wanted the library to become the main attraction of the site and asked for a better name.

Chosen product-facing name:

**QE Playbook**

Reasoning:

- More active and practical than "Library"
- Stronger fit for Quality Engineering audience
- Suggests usable guides, patterns, field notes, and training material
- Still professional and not gimmicky

The URL remains `library.html` for now to avoid breaking existing links.

### 3. Latest Committed Playbook Improvements
Latest commit `2a4603f` includes:

- Visible nav/footer labels changed from `Library` to `QE Playbook`
- Home hero primary CTA changed to `Explore QE Playbook`
- New home-page `QE Playbook` feature section added near the top
- `library.html` hero redesigned around the Playbook positioning
- Playbook search placeholder and labels updated
- Top nav overlap on home page fixed
- Missing design token issues fixed for hero spacing/text sizing
- Stale `links.html` labels updated

### 4. Mobile And Theme Rules
Mobile compatibility and theme consistency are important project requirements.

- Default theme should be `light`.
- User-selected theme is stored in `localStorage` under the key `theme`.
- `assets/site.js` is the source of truth for theme toggle behavior.
- Theme toggle should work globally across pages that include `assets/site.js`.
- Session pages should use `<html data-theme="light">` and respond to `[data-theme="dark"]` where they define page-specific styles.
- On mobile, verify there is no horizontal overflow and fixed nav/progress bars do not cover page content.

---

## Current Page Behavior

### Home Page: `index.html`
Primary purpose:

- Introduce Sandeep as a QE leader
- Drive visitors into the QE Playbook
- Still provide About, Experience, Skills, LinkedIn, and Contact sections

Important sections:

- Fixed top navigation
- Hero with profile image and stats
- Primary CTA: `Explore QE Playbook`
- QE Playbook feature section
- About
- Experience
- Skills
- Certifications
- LinkedIn badge section
- Contact
- Footer

Known note:

- The top nav is fixed. When editing hero spacing, verify it does not overlap content.

### QE Playbook Page: `library.html`
Primary purpose:

- Searchable collection of learning/session/training content
- Uses `library-data.js` as the content catalog
- Renders featured cards and all entries dynamically

Current visible title:

**QE Playbook**

Current dynamic features:

- Total entries count
- Category count
- Latest added date
- Search input
- Category filter chips
- Sort dropdown
- Featured section
- Empty state

### Data Source: `library-data.js`
Each Playbook entry uses this shape:

```js
{
  id: "unique-id",
  title: "Entry title",
  category: "Training",
  date: "2026-05-18",
  duration: "20 min read",
  description: "Short description.",
  tags: ["Tag One", "Tag Two"],
  file: "sessions/example.html",
  featured: true
}
```

Currently active entries include:

- `website-hosting-tutorial`
- `atlassian-infrastructure-deep-dive`
- `playwright-getting-started-2026`
- `qe-is-not-just-testing`

Several possible future entries are present but commented out.

---

## Design System Notes

The site uses hand-written CSS.

### Shared Design Tokens
Defined in:

`assets/styles.css`

Important token groups:

- Fonts:
  - `--font-display`: Instrument Serif
  - `--font-body`: DM Sans
- Text sizes:
  - `--text-xs`
  - `--text-sm`
  - `--text-base`
  - `--text-lg`
  - `--text-xl`
  - `--text-2xl`
  - `--text-3xl`
- Spacing:
  - `--space-1` through `--space-32`
- Colors:
  - Light/dark theme variables
  - Category colors for Training, Course, Session, Project, Workshop

### JavaScript Behavior
Shared behavior lives in:

`assets/site.js`

It handles:

- Theme toggle with localStorage
- Mobile navigation
- Scroll-to-top button
- Reading progress bar
- Table of contents active state
- Copy-code buttons
- LinkedIn badge theme sync

Avoid duplicating these behaviors inline unless there is a clear reason.

---

## How To Add A New Playbook Entry

1. Create a new HTML file in `sessions/`.
2. Prefer starting from:

```text
sessions/_session-template.html
```

3. Add or update the entry in:

```text
library-data.js
```

4. If the page was generated externally and does not have the shared shell, run:

```sh
node scripts/add-session-shell.js sessions/new-session.html
```

5. Test locally:

```sh
python3 -m http.server 8000
```

Open:

```text
http://127.0.0.1:8000/index.html
http://127.0.0.1:8000/library.html
```

---

## Recommended Next Improvements

### High Priority
1. Improve the QE Playbook content model:
   - Add `level`: Beginner / Intermediate / Advanced
   - Add `topic`: Automation / QE Strategy / AI / Web / Platform
   - Add `summaryBullets` or `takeaways`
   - Add `recommendedFor`

2. Make the Playbook cards more compelling:
   - Show "Start here" badge for beginner content
   - Add reading path sections
   - Add topic-based grouping
   - Add "Latest", "Most practical", or "For QE leaders" views

3. Add more real content:
   - AI in Testing
   - Playwright MCP / agentic testing
   - API testing with Postman/RestAssured
   - Test strategy for fintech products
   - QE role in SAFe/Agile programs

### Medium Priority
1. Add SEO basics:
   - `robots.txt`
   - `sitemap.xml`
   - Better Open Graph image
   - JSON-LD Person/Website schema

2. Add PWA basics:
   - `manifest.json`
   - favicon files
   - theme color

3. Improve image performance:
   - Keep `profile.webp` as the preferred profile image
   - Keep `profile.jpg` as fallback where useful
   - Add explicit dimensions and loading behavior

4. Add a content workflow:
   - Use a repeatable template for AI-generated sessions
   - Keep all session metadata in `library-data.js`

### Low Priority
1. Add analytics only if the user wants it:
   - Plausible or Umami preferred over heavy analytics

2. Consider framework migration later:
   - Astro is still a good future fit
   - Do not restart migration unless there is time to migrate all pages and session content cleanly

---

## Known Cautions For Future AI Tools

1. Do not start an Astro/Next/Tailwind migration without explicit approval.
2. Do not delete or rewrite `sessions/` content casually.
3. Keep `library.html` URL unless the user explicitly approves a redirect/rename plan.
4. Preserve `legacy` branch.
5. Always check `git status` before editing.
6. If there are uncommitted user changes, do not overwrite or revert them.
7. The site uses static relative links, so check links in local static server.
8. If changing nav labels, update all relevant files:
   - `index.html`
   - `library.html`
   - `links.html`
   - session shell/template if needed
9. If adding session pages, also update `library-data.js`.
10. Verify the fixed nav does not overlap hero/page content.
11. Verify mobile compatibility at around 390px wide before shipping visual changes.
12. Do not add page-specific theme logic if shared `assets/site.js` can handle it.

---

## Suggested Prompt For Next AI Session

Use this exact prompt to resume with another AI tool:

```text
You are working on my static personal website at /Users/sandeepsingh/my-website.
First read SESSION_HANDOFF.md and README.md.
Then inspect git status, index.html, library.html, library-data.js, assets/styles.css, assets/library.css, and assets/site.js before making changes.

Important: this is currently a static HTML/CSS/JS site. Do not migrate to Astro/Next/Tailwind unless I explicitly ask. The main attraction is the QE Playbook at library.html. Preserve existing content and avoid overwriting user changes.

After changes, run a local static server with python3 -m http.server 8000 and verify index.html and library.html visually.
```

---

## Best Way To Work Across Multiple AI Tools

When using Codex, Cursor, Perplexity, Claude, or other tools on the same project, use this workflow:

1. **Start every session with the handoff**
   - Share `SESSION_HANDOFF.md`
   - Ask the tool to read it before proposing changes

2. **Make the tool inspect the repo**
   - Require `git status --short --branch`
   - Require reading the specific files it will edit
   - Do not rely only on pasted summaries

3. **Work in small, committed steps**
   - One goal per session
   - Commit after each stable improvement
   - Use clear commit messages

4. **Update this handoff after meaningful changes**
   - Add latest commit hash
   - Add changed files
   - Add decisions made
   - Add next steps

5. **Avoid parallel edits in different tools**
   - Finish or commit work in one tool before opening another
   - If switching mid-work, paste `git diff --stat` and `git status`

6. **Keep a "do not do" section**
   - For this project: do not casually migrate frameworks, rename URLs, or delete session pages

7. **Ask for verification, not just code**
   - The tool should run a local static server
   - It should verify home page, Playbook page, mobile nav, and search/filter behavior

8. **Use Git as the source of truth**
   - If an AI summary conflicts with `git status`, trust Git
   - If unsure, inspect the files directly

---

## Current Recommended Next Task

The best next step is to deepen the **QE Playbook** experience:

- Add richer metadata to `library-data.js`
- Create topic/learning-path groupings
- Make cards show why each entry is valuable
- Add one or two new high-quality session pages using the existing template

This improves the main attraction without risking another framework migration.
