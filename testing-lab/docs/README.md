# QE Testing Lab

QE Testing Lab is a React web application designed as a realistic practice product for functional testing, exploratory testing, and future Playwright automation.

## Architecture Decision

The first version lives inside the existing `my-website` repository under `testing-lab/`.

This is the recommended starting approach because:

- The personal website can link to the testing product immediately.
- The testing product can link back to the main website.
- Documentation, portfolio content, and the demo product stay together while the idea is still evolving.
- It is still modular enough to split into a separate repository later.

Move it into a dedicated repository when the product has its own deployment environments, release process, CI/CD pipelines, test framework, backlog, and versioning strategy.

## Framework Choice

The app uses Vite + React.

Reasons:

- React is widely used in product companies and interview demos.
- Vite keeps local development and CI builds fast.
- Playwright works very well with React apps because the DOM can be built from predictable component states.
- Component boundaries help create focused automation targets.

## Locator Contract

Every meaningful interactive element and test surface must include:

```html
automation-id="short-stable-key"
```

Rules:

- Use `automation-id` as the primary Playwright locator.
- Keep values short, stable, lowercase, and descriptive.
- Do not use random runtime-generated values.
- Do not change an existing `automation-id` unless the test contract intentionally changes.
- Prefer page or component prefixes such as `btn-`, `fld-`, `sel-`, `tbl-`, `row-`, `dlg-`, `nav-`, and `sec-`.

Example Playwright usage planned for later:

```ts
await page.locator('[automation-id="btn-profile-submit"]').click();
```

## Current Feature Areas

- Compact test-environment strip (no marketing hero).
- Deep-linked views: `?view=forms|commerce|workflow|settings`.
- Dashboard metrics tied to checklist / notifications; dismissible notes; sandbox-down env.
- Registration form: validation, password hints, confirm password, terms, file type/size, notes counter.
- Orders table: search, filter, sort (incl. amount/date), pagination, empty state, modal, locked terminal statuses.
- Gated multi-step workflow with locked future steps.
- Settings: API reveal/copy/regen, flags, audit log, CSV download, reset lab, negative confirm.
- Theme + flags persist; orders/checklist persist for the tab session.
- Dual locators (`automation-id` + `data-testid`).
- **Money Transfer Lab** — `/testing-lab/money-transfer`. See [money-transfer/](./money-transfer/).

## Main lab docs

| Doc | Audience |
|-----|----------|
| [main-lab/PRODUCT.md](./main-lab/PRODUCT.md) | Product |
| [main-lab/ENGINEERING.md](./main-lab/ENGINEERING.md) | Engineering |
| [main-lab/US-MAIN.md](./main-lab/US-MAIN.md) | Product + QE |
| [main-lab/TEST_SCENARIOS.md](./main-lab/TEST_SCENARIOS.md) | QE / automation ingest |

## Money Transfer Auth Lab docs

| Doc | Audience |
|-----|----------|
| [PRODUCT.md](./money-transfer/PRODUCT.md) | Product |
| [ENGINEERING.md](./money-transfer/ENGINEERING.md) | Engineering |
| [US-LOGIN.md](./money-transfer/US-LOGIN.md) | Product + QE |
| [US-TRANSFER.md](./money-transfer/US-TRANSFER.md) | Product + QE |
| [TEST_SCENARIOS.md](./money-transfer/TEST_SCENARIOS.md) | QE / automation ingest |

Local URL:

```text
http://localhost:5173/testing-lab/money-transfer
```

Seed password: `Welcome123` · Demo OTP: `147272` · Sample phone: `+91 98765 43210`

## Local Development

From the repository root:

```sh
cd testing-lab
npm install
npm run dev
```

Open the Vite URL, usually:

```text
http://localhost:5173/testing-lab/
```

Auth lab:

```text
http://localhost:5173/testing-lab/money-transfer
```

## Build

```sh
cd testing-lab
npm run build
```

## Publish To Static Hosting

The public `/testing-lab/` route must serve compiled assets, not the Vite development entry.

After changing React source, run:

```sh
cd testing-lab
npm run publish:static
```

This builds the app, copies compiled files into `testing-lab/assets/`, and updates `testing-lab/index.html` for static hosting.

## Future Roadmap

- Expand role-based pages and permissions.
- Add API mocking using MSW.
- Add visual regression targets.
- Add CI/CD examples for build, unit tests, Playwright smoke tests, and release gates.
- Add product-style release notes and changelog.
