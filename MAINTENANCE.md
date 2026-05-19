# How to maintain your website (Sandeep)

This guide is written for you as the site owner — not for web developers. Your site is **static HTML**: there is no React, no build step, and no database. You edit files, push to GitHub, and Cloudflare Pages shows the updated site.

---

## What lives where (simple map)

| You want to… | Open this file or folder |
|--------------|--------------------------|
| Change homepage text, job history, skills | `index.html` |
| Add or reorder library cards | `library-data.js` |
| Add or reorder QE Repository cards | `qe-repository-data.js` |
| Change library page intro or layout | `library.html` |
| Change QE Repository page | `qe-repository.html` |
| Write a new article / training note | `sessions/` (see below) |
| Write QE-specific resource (template, case study) | `qe-repo/` (see below) |
| Change colours/fonts site-wide | `assets/tokens.css` |
| Change top navigation & footer (home + library) | `assets/site-chrome.css` |
| Change homepage-only sections | `assets/home.css` |
| Change library-only layout/cards | `assets/library.css` |
| Theme toggle, mobile menu, scroll button | `assets/site.js` (usually leave as-is) |
| Session page header (“All Posts”, progress bar) | `assets/session-shell.css` |
| Old pages you do not use | `Archive/` (safe to ignore) |
| Ideas for future posts (not live yet) | `CONTENT_IDEAS.md` |
| Ideas for future QE resources | `QE_REPOSITORY_IDEAS.md` |

**Live site:** https://sandeepsingh87.in  
**GitHub repo:** https://github.com/sandeepsingh87/my-website

---

## Library vs QE Repository

| | **Knowledge Library** | **QE Repository** |
|---|----------------------|-------------------|
| **Purpose** | All your published sessions, courses, workshops | Quality Engineering material others can reuse |
| **Catalog file** | `library-data.js` | `qe-repository-data.js` |
| **Browse page** | `library.html` | `qe-repository.html` |
| **New HTML files** | Usually `sessions/` | Usually `qe-repo/` (can also link to `sessions/` |
| **Categories** | Training, Course, Session, Project, Workshop | Training, Case Study, Project, Template, Reference, Playbook |

The same HTML file can appear in **both** catalogs if it helps QEs (e.g. a Playwright guide).

---

## Everyday workflow: add a QE Repository resource

1. Copy `qe-repo/_resource-template.html` → `qe-repo/my-topic.html`
2. Edit the content inside `<main>` and the `<title>` / description in `<head>`
3. Open `qe-repository-data.js` and add a new object (copy an existing one)
4. Add the page URL to `sitemap.xml`
5. `git add` → `git commit` → `git push`

Categories for QE Repository: **Training**, **Case Study**, **Project**, **Template**, **Reference**, **Playbook**.

---

## Everyday workflow: publish a new session

This is the most common task.

### Step 1 — Create the HTML page

**Recommended:** copy the template.

1. Duplicate `sessions/_session-template.html`
2. Rename it, e.g. `sessions/my-new-topic.html`
3. Edit the `<title>`, description, and everything inside `<main>`

The template already includes the correct header, footer, reading progress bar, and dark mode.

### Step 2 — Register it in the library

Open `library-data.js` and add a new object to the `LIBRARY` array (copy an existing entry and change the fields):

- `id` — short slug, no spaces (e.g. `"api-testing-basics"`)
- `title`, `description`, `tags`
- `category` — one of: `Training`, `Course`, `Session`, `Project`, `Workshop`
- `date` — `YYYY-MM-DD`
- `duration` — e.g. `"10 min read"`
- `file` — path to your HTML, e.g. `"sessions/my-new-topic.html"`
- `featured` — `true` to show in the featured section on the library page

### Step 3 — Add SEO (search & LinkedIn previews)

In your new session file’s `<head>`, include (adjust text and URLs):

```html
<meta name="description" content="One sentence summary." />
<link rel="canonical" href="https://sandeepsingh87.in/sessions/my-new-topic.html" />
<meta property="og:title" content="Your title" />
<meta property="og:description" content="Same as description." />
<meta property="og:url" content="https://sandeepsingh87.in/sessions/my-new-topic.html" />
<meta property="og:type" content="article" />
```

Copy the JSON-LD block from `sessions/getting-started-with-playwright-2026.html` if you want rich Google results.

### Step 4 — Update the sitemap

Open `sitemap.xml` and add a `<url>` block for the new page (copy an existing session entry and change `loc` and `lastmod`).

### Step 5 — Publish

```sh
cd /path/to/my-website
git add .
git commit -m "Add session: short title"
git push
```

Cloudflare Pages rebuilds automatically after push (usually 1–2 minutes).

---

## If ChatGPT / Cursor generates a full HTML file for you

1. Save the file under `sessions/your-file.html`
2. From the **repo root**, run:

```sh
node scripts/add-session-shell.js sessions/your-file.html
```

That script adds the shared header, footer, progress bar, and `site.js`. It also tries to **remove duplicate** old navigation if the generator already included one.

3. Open the file in a browser and check you only see **one** top bar and **one** footer.
4. Still add the entry in `library-data.js` and `sitemap.xml` as above.

---

## Fixing links

- On the **homepage** and **library**, links look like `library.html` or `index.html#skills`.
- Inside **sessions**, home is `../index.html` and library is `../library.html`.
- Avoid `href="/"` on session pages — it can break on some hosts. The site now uses relative paths on purpose.

---

## Changing site colours or fonts

1. **`assets/tokens.css`** — main colours, spacing, fonts (affects home + library).
2. **`assets/session-shell.css`** — session header/footer only.
3. Each session file may still have its **own** `<style>` block for article-specific design (e.g. the Atlassian page uses a different font). That is OK for one-off pages.

After editing CSS, refresh the browser with a hard reload (Cmd+Shift+R on Mac).

---

## `links.html`

`/links` and `links.html` **redirect** to the library. The file is tiny on purpose. Do not paste a full copy of the library into it again.

---

## Profile photo

- File: `profile.jpg` at the repo root (used on the homepage and some session pages).
- Keep it under ~300 KB if possible. On Mac you can resize with Preview → Export → lower quality.

---

## Files you can ignore

| Item | Why |
|------|-----|
| `Archive/` | Old versions kept for reference |
| `blog/` | Empty placeholder; all posts live under `sessions/` |
| `scripts/maintain-site.js` | One-time helper used during site cleanup (developers only) |

---

## Quick checks before you push

1. Open `index.html` locally — does the homepage look right?
2. Open `library.html` — does your new card appear and open the right session?
3. Open the new session — single header, progress bar works when scrolling?
4. Click **Home** and **All Posts** — do they go to the right pages?

---

## Getting help from Cursor / AI

When asking for help, say:

- What you want to change (e.g. “add a new Playwright session”)
- That the site is **static HTML** in this repo
- Point to `MAINTENANCE.md` and `sessions/_session-template.html`

---

## Summary cheat sheet

```
New session       → sessions/_session-template.html → library-data.js → push
New QE resource   → qe-repo/_resource-template.html → qe-repository-data.js → push
AI session HTML   → node scripts/add-session-shell.js sessions/foo.html
AI QE repo HTML   → node scripts/add-qe-repo-shell.js qe-repo/foo.html
Homepage          → index.html + assets/home.css
Library list      → library-data.js
QE Repository list → qe-repository-data.js
Colours           → assets/tokens.css
```

You do **not** need npm, Node packages, or a bundler for normal updates — only Node for the optional `add-session-shell.js` script.
