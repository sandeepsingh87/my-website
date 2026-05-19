# Session pages

Training notes, talks, and articles live here as plain HTML files.

**Full instructions:** see **[../MAINTENANCE.md](../MAINTENANCE.md)** in the repo root.

## Quick steps

1. Copy `_session-template.html` → rename → edit content inside `<main>`.
2. Add an entry in `../library-data.js`.
3. Add the URL to `../sitemap.xml`.
4. `git push` to publish.

## AI-generated HTML

```sh
# From repo root
node scripts/add-session-shell.js sessions/your-file.html
```

See MAINTENANCE.md for what the script does and how to avoid duplicate headers.
