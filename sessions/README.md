# Session Page Workflow

Use this folder for new training notes, talks, articles, and generated HTML pages.

## Best path for new pages

1. Copy `_session-template.html` to a new filename.
2. Replace the title, metadata, and content inside `<main>`.
3. Add the page to `../library-data.js`.

The template already includes the consistent header, footer, scroll-to-top button, and reading progress bar.

## If an AI tool generates a full HTML file

Place the generated file in `sessions/`, then run:

```sh
node scripts/add-session-shell.js sessions/new-session.html
```

The script adds:

- `../assets/session-shell.css`
- the Sandeep Singh header with the `All Posts` button
- the reading progress bar
- the shared footer
- `../assets/site.js`

If the generated file already has its own header or footer, remove that old markup after running the script so the page has only one top navigation and one footer.
