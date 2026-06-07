# Session Handoff — QE Testing Lab

Use this file as startup context when continuing this project in another AI tool or future Codex session.

## Project Location

`/Users/sandeepsingh/my-website/testing-lab`

## Current Goal

Build a React-based testing website that can become the best candidate application for:

- Functional testing practice.
- Automation testing practice.
- Playwright framework development.
- Interview demos showing realistic product delivery, testing, CI/CD, release, and quality engineering workflows.

## Current Architecture

- Parent repo: `/Users/sandeepsingh/my-website`
- App folder: `testing-lab/`
- Framework: Vite + React
- Styling: plain CSS in `src/styles/app.css`
- Fixture data: `src/data/fixtures.js`
- Main app: `src/main.jsx`
- Main site cross-link: parent `index.html` header links to `testing-lab/`
- Testing app cross-link: app header links back to `../index.html`

## Key Decision

Keep QE Testing Lab in the same Git repo for now. This is easier while the personal site and product demo are tightly connected.

Split it into a separate repo later when the product has mature CI/CD, environments, versioning, deployment ownership, and a dedicated Playwright framework.

## Mandatory Locator Rule

Every meaningful control, row, panel, dialog, form, and automation target must have:

```html
automation-id="short-stable-key"
```

The future Playwright framework should use this selector pattern:

```ts
page.locator('[automation-id="btn-profile-submit"]')
```

Do not replace this with `data-testid` unless the project explicitly decides to change the locator strategy.

## Existing Feature Modules

- Dashboard
- Forms Lab
- Commerce Lab
- Workflow Lab
- Settings Lab
- Order Modal
- Toast feedback
- Mobile drawer navigation
- Theme toggle

## Important Files

```text
testing-lab/
├── package.json
├── vite.config.js
├── index.html
├── src/
│   ├── main.jsx
│   ├── data/fixtures.js
│   └── styles/app.css
└── docs/
    ├── README.md
    └── SESSION_HANDOFF.md
```

## Recommended Next Enhancements

1. Add route support with React Router.
2. Add login/logout and role-based access pages.
3. Add API mock layer with MSW.
4. Add a test-data reset button for automation repeatability.
5. Add accessibility examples and intentionally invalid form states.
6. Add Playwright framework in a separate folder or future repo.
7. Add CI stages: install, build, lint, unit test, Playwright smoke, artifact upload.

## Development Commands

```sh
cd testing-lab
npm install
npm run dev
npm run build
```
