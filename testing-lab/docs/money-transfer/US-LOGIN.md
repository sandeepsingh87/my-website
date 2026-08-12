# User Story — Login (Password & OTP)

```yaml
id: US-MT-LOGIN-001
title: Authenticate to Money Transfer Auth Lab
module: money-transfer
type: user-story
priority: P0
labels: [authentication, login, otp, session, qa-playground]
automation_ingest: true
route: /testing-lab/money-transfer
```

## Story

**As a** QA engineer practicing authentication flows  
**I want** to sign in with password or OTP using published test credentials  
**So that** I can exercise happy-path, negative, and session scenarios in a safe sandbox

## Context

- Environment is clearly labelled as a test sandbox
- Seed credentials are visible on the page
- No real SMS/email delivery; OTP is static `147272`
- Success opens the mock money-transfer dashboard (not a real account)

## Acceptance criteria

### AC-L01 — Password login with email
Given I am on the Auth Lab login screen  
And I select **Password Login**  
When I enter a seeded email (`testuser01@example.com`) and password `Welcome123`  
And I click **Log in**  
Then I am authenticated  
And I see the mock dashboard showing my display name  
And a success toast may appear

### AC-L02 — Password login with phone
Given Password Login is selected  
When I enter seeded phone `+919876543210` (or normalized equivalent) and password `Welcome123`  
And I click **Log in**  
Then I reach the mock dashboard

### AC-L03 — OTP login with email
Given **OTP Login** is selected  
When I enter a seeded email and click **Send OTP**  
And the account is recognized  
And I enter demo OTP `147272` and click **Verify OTP**  
Then I reach the mock dashboard  
And success feedback is readable (not a blank toast)

### AC-L03b — Unknown or invalid identifier on OTP send
Given OTP Login is selected  
When identifier format is invalid  
Then I remain on the identifier step with a field error  
When identifier format is valid but not a known test account  
Then I remain on the identifier step with a clear account-not-found error  
And I do not reach the OTP entry step

### AC-L04 — OTP login with phone
Given OTP Login is selected  
When I complete Send OTP + Verify with seeded phone and OTP `147272`  
Then I reach the mock dashboard

### AC-L05 — Invalid password
When I submit a known identifier with a wrong password  
Then I see a non-sensitive error  
(`Invalid test credentials. Please use one of the credentials provided in the Test Credentials panel.`)  
And I remain on the login screen  
And the system does not reveal whether the identifier exists

### AC-L06 — Unknown identifier (password)
When I submit an unknown email/phone with any password  
Then I see the same generic invalid-credentials error

### AC-L07 — Identifier / password validation
When identifier or password is blank, or email/phone format is malformed  
Then inline or submit validation errors appear before auth is attempted

### AC-L08 — Invalid OTP
When OTP is blank, non-numeric, not 6 digits, or not `147272`  
Then verification fails with a clear OTP error  
And I am not authenticated

### AC-L09 — Unknown user + correct OTP
When identifier is unknown and OTP is `147272`  
Then verification fails (no account access)

### AC-L10 — Forgot password (sandbox)
When I click **Forgot password?**  
Then I see that reset is unavailable and I should use Test Credentials  
And no email/SMS reset flow starts

### AC-L11 — Remember Me
When Remember Me is checked and password login succeeds  
Then only the user id may be stored in localStorage  
And password/OTP are never stored in localStorage  
When Remember Me is unchecked  
Then session uses sessionStorage semantics only

### AC-L12 — Logout
Given I am on the dashboard  
When I click **Logout**  
Then session is cleared  
And I return to the login experience  
And I may see a logout confirmation message

### AC-L13 — Session persistence (tab)
Given I authenticated in this tab  
When I reload `/testing-lab/money-transfer` while sessionStorage still has the session  
Then I remain on the dashboard

### AC-L14 — Safety labelling
Given I am on the Auth Lab  
Then a visible test-environment banner states no real money / no real accounts  
And wording does not claim a real money-transfer provider login

### AC-L15 — Automation hooks
Given the login UI  
Then stable `data-testid` / `automation-id` attributes exist for tabs, fields, submit, errors, and dashboard controls

## Automation notes

- Prefer locators: `[data-testid="login-submit"]`, `[data-testid="otp-verify"]`, `[data-testid="dashboard"]`
- Seed password: `Welcome123`
- Seed OTP: `147272`
- Scenario mapping: see `TEST_SCENARIOS.md` (`TC-LOGIN-*`, `TC-OTP-*`, `TC-SESSION-*`)

## Out of scope for this story

- Real MFA providers
- Password reset email
