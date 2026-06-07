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

- Responsive desktop and mobile navigation.
- Dashboard metrics.
- Environment status list.
- Release checklist with checkboxes.
- Notifications.
- Registration form with text, email, password, dropdown, range, checkbox, radio, textarea, and file upload controls.
- Orders table with search, filtering, sorting, row actions, status changes, and modal details.
- Multi-step workflow.
- Settings accordions.
- Toast notifications.
- Theme toggle.
- Negative scenario trigger.

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

## Build

```sh
cd testing-lab
npm run build
```

## Future Roadmap

- Add React Router for deeper URL-based test scenarios.
- Add authentication simulation with valid and invalid login users.
- Add API mocking using MSW.
- Add seeded test data and reset controls.
- Add accessibility test examples.
- Add visual regression targets.
- Add role-based pages and permissions.
- Add CI/CD examples for build, unit tests, Playwright smoke tests, and release gates.
- Add product-style release notes and changelog.
