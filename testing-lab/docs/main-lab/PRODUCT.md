# Product Brief — QE Testing Lab (Main)

| Field | Value |
|-------|-------|
| Product | QE Testing Lab |
| Module | Main lab (Dashboard, Forms, Commerce, Workflow, Settings) |
| Route | `/testing-lab/` |
| Status | Demo / sandbox |
| Audience | QE engineers, automation learners, interview demo viewers |

## Purpose

A **safe, locator-stable product simulation** for functional, exploratory, and automation practice:

- Navigation, theme, toasts, modals, and responsive layout
- Forms with mixed controls and client-side validation
- Data grid: search, filter, sort, pagination, empty state, row actions
- Gated multi-step workflow
- Settings: secrets, flags, audit, download, reset, negative confirm
- Deep links via `?view=`

Auth / money-transfer lives in a sibling module: [../money-transfer/PRODUCT.md](../money-transfer/PRODUCT.md).

## Safety boundaries

- Demo only. No production data, payments, or real identity.
- Visible strip: `TEST ENVIRONMENT · Testing Lab · … · No production data`
- Seed data is public and fake

## Personas

| Persona | Need |
|---------|------|
| Manual QE | Happy-path and negative flows with published locators |
| Automation engineer | Stable `automation-id` / `data-testid`, deep links, deterministic data |
| Portfolio visitor | Polished, realistic practice product |
| AI test-gen | Structured stories → scenarios |

## In scope

- Five primary views + Auth Lab link
- Theme persist (`qe-lab-theme`)
- Session persist for orders and checklist
- Feature flags persist (`qe-lab-flags`)
- Reset lab data
- CSV download of orders

## Out of scope

- Real backend / MSW APIs (roadmap)
- Role-based access control
- Visual regression CI (roadmap)

## Success metrics

- Visitor can use every tab without guessing
- Documented scenarios in `TEST_SCENARIOS.md` are executable
- Existing `automation-id` values stay stable
- Preview and static publish serve the same compiled app

## Related docs

- [ENGINEERING.md](./ENGINEERING.md)
- [US-MAIN.md](./US-MAIN.md)
- [TEST_SCENARIOS.md](./TEST_SCENARIOS.md)
