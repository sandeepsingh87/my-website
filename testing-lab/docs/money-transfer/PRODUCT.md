# Product Brief — Money Transfer Authentication Lab

| Field | Value |
|-------|-------|
| Product | QE Testing Lab |
| Module | Money Transfer Authentication Lab |
| Route | `/testing-lab/money-transfer` |
| Status | Demo / sandbox |
| Audience | QE engineers, automation learners, interview demo viewers |

## Purpose

Provide a **safe, deterministic authentication playground** so testers can practice:

- UI and functional testing of login / OTP / registration
- Negative and validation testing
- Exploratory testing with known seed data
- Locator-stable automation (Playwright / Selenium / Cypress)
- Feeding user stories into AI-assisted test generation frameworks

This module simulates a fintech-style login **and** send-money UX **without** any real money movement, provider branding, or external identity/payout services.

## Safety boundaries (non-negotiable)

- Demo / test application only
- No real money-transfer provider branding, logos, or deceptive wording
- No connection to real authentication, SMS, email, banking, or payment APIs
- No collection or transmission of real PII for production use
- All seed credentials are intentionally public and fake
- Successful login never implies a real financial account

Visible badge on the page:

```text
TEST ENVIRONMENT • NO REAL MONEY • NO REAL ACCOUNTS
```

## Personas

| Persona | Need |
|---------|------|
| Manual QE | Run happy-path and negative flows with published credentials |
| Automation engineer | Stable selectors + deterministic OTP/password |
| Product / portfolio visitor | See a polished, realistic practice product |
| AI test-gen framework | Ingest structured user stories → emit scenarios/scripts |

## In scope (v1)

- Password login (email or phone)
- OTP login (static demo OTP)
- Registration of local demo accounts (browser storage)
- Test credentials panel with copy actions
- Mock post-login dashboard + logout
- Demo transfer: amount/quote → receiver → review → receipt
- Remember Me (user id only)
- Accessibility basics and responsive layout
- Product / Eng / QE documentation

## Out of scope (v1)

- Real password reset
- Real SMS / email OTP delivery
- Real payout rails or live FX
- Backend / API auth
- Role-based permissions

## Success metrics

- Visitor finds the Auth Lab visually clear and professional enough to explore without friction
- Tester can complete password + OTP login with seed users without guessing
- Newly registered local account can log in in the same browser
- All documented scenarios in `TEST_SCENARIOS.md` are executable manually
- Selectors remain stable across UI polish
- Credentials panel remains readable on mobile (no horizontal overflow / overlapping copy actions)

## Related docs

- [ENGINEERING.md](./ENGINEERING.md)
- [US-LOGIN.md](./US-LOGIN.md)
- [US-REGISTRATION.md](./US-REGISTRATION.md)
- [US-TRANSFER.md](./US-TRANSFER.md)
- [TEST_SCENARIOS.md](./TEST_SCENARIOS.md)
