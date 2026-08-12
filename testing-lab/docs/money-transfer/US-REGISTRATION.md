# User Story — Registration

```yaml
id: US-MT-REG-001
title: Create a local demo account in Money Transfer Auth Lab
module: money-transfer
type: user-story
priority: P0
labels: [authentication, registration, validation, qa-playground]
automation_ingest: true
route: /testing-lab/money-transfer
```

## Story

**As a** QA engineer practicing registration and validation  
**I want** to create a local demo account with clear field rules and duplicate checks  
**So that** I can test positive/negative registration and then log in with the new account

## Context

- Accounts are stored only in the browser (`localStorage`)
- No payment, bank, government ID, or DOB fields
- Terms checkbox must state that this is a test/demo account
- Demo OTP for registered accounts remains `147272`

## Acceptance criteria

### AC-R01 — Registration form present
Given I am logged out on the Auth Lab  
Then I see **Create a Test Account** with fields: first name, last name, email, mobile, password, confirm password, terms checkbox, submit

### AC-R02 — Valid registration
When I submit valid unique data and accept terms  
Then the account is created locally  
And I see a success state with email and phone  
And I can navigate to login via **Go to Login**

### AC-R03 — Login after registration
Given I just registered with password `MyPass123` (example)  
When I log in with that email/phone and password  
Then authentication succeeds and the dashboard opens

### AC-R04 — First / last name rules
When first or last name is missing or violates `2–50` letters/spaces/hyphen/apostrophe rules  
Then a field error is shown and registration does not succeed

### AC-R05 — Email validation
When email is malformed (`abc`, `abc@`, `abc@domain`, `@domain.com`, spaces)  
Then registration is blocked with an invalid email message  
And valid emails are trimmed and lowercased for storage/lookup

### AC-R06 — Phone validation
When phone fails international-format rules after normalization  
Then registration is blocked with an invalid mobile message

### AC-R07 — Password strength
When password is under 8 chars, over 64 chars, or missing upper/lower/digit  
Then registration is blocked  
And password requirement hints reflect current strength  
And inputs enforce `maxLength` so users cannot paste unbounded strings

### AC-R07b — Field length caps
Given any Auth Lab text input  
When the user types or pastes beyond the field limit  
Then input stops at the configured max (name 50, email 100, phone 20, password 64, identifier 100, OTP 6)

### AC-R08 — Confirm password
When confirm password does not match  
Then error **Passwords do not match.** is shown

### AC-R09 — Terms required
When terms checkbox is unchecked  
Then registration is blocked until accepted  
Wording must indicate test/demo account (not a real financial account)

### AC-R10 — Duplicate email
When email already exists among seed or registered users  
Then registration fails with a duplicate email message

### AC-R11 — Duplicate phone
When phone already exists among seed or registered users  
Then registration fails with a duplicate phone message

### AC-R12 — No external side effects
When registration succeeds or fails  
Then no SMS, email, or external API is called  
And no financial fields are collected

### AC-R13 — Automation hooks
Then stable selectors exist for all registration inputs, terms, submit, errors, and success (`register-*`, `register-success`)

## Automation notes

- Locators: `[data-testid="register-submit"]`, `[data-testid="register-error"]`, `[data-testid="register-success"]`
- Avoid colliding with seed emails/phones when testing happy-path registration
- Scenario mapping: `TEST_SCENARIOS.md` (`TC-REG-*`)

## Out of scope for this story

- Email verification workflow
- Captcha
- Cross-device account sync
