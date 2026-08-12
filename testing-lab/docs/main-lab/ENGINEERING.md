# Engineering — QE Testing Lab (Main)

## Stack

- Vite + React 18
- `react-router-dom` v6 — basename `/testing-lab`
- Styles: `src/styles/app.css` (Wise-inspired tokens; Plus Jakarta Sans)
- Dual locators: `automation-id` + `data-testid` via `src/lib/tid.js`

## Routes

| Path | View |
|------|------|
| `/testing-lab/` | Dashboard |
| `/testing-lab/?view=forms` | Forms |
| `/testing-lab/?view=commerce` | Commerce |
| `/testing-lab/?view=workflow` | Workflow |
| `/testing-lab/?view=settings` | Settings |
| `/testing-lab/money-transfer` | Auth Lab |

Invalid `view` values fall back to Dashboard.

## Visual design

Sage canvas, lime primary CTAs, 16px radii — same family as Auth Lab (`design-md/wise` interpretation, no third-party branding). Compact test-environment strip at the top of every view.

## Source layout

```text
testing-lab/src/
  pages/QeLabApp.jsx
  components/qe-lab/
  data/fixtures.js
  lib/tid.js
  lib/qe-lab/storage.js
  styles/app.css
```

## Storage

| Key | Storage | Contents |
|-----|---------|----------|
| `qe-lab-theme` | localStorage | `light` or `dark` |
| `qe-lab-flags` | localStorage | `{ betaGrid, darkPreview, noisyToasts }` |
| `qe-lab-checklist` | sessionStorage | release checklist |
| `qe-lab-orders` | sessionStorage | order rows and statuses |

**Reset lab data** restores fixtures and clears session keys.

## Locator contract

Do not rename existing `automation-id` values. New surfaces get new ids. Playwright:

```ts
await page.locator('[automation-id="nav-commerce"]').click();
await page.locator('[data-testid="inp-order-search"]').fill('ORD-1001');
```

## Local / preview

```sh
cd testing-lab
npm install
npm run dev          # http://localhost:5173/testing-lab/
npm run preview      # http://localhost:4173/testing-lab/
```

`base` is `/testing-lab/`. Visiting `/testing-lab` (no slash) 308-redirects to `/testing-lab/`.

## Publish

```sh
npm run publish:static
```

Cross-platform (`scripts/publish-static.mjs`). Copies `dist` into `testing-lab/assets` and `testing-lab/index.html`.
