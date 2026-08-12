# User Story — Test Money Transfer to Receipt

```yaml
id: US-MT-TRANSFER-001
title: Send a demo money transfer through to receipt
module: money-transfer
type: user-story
priority: P0
labels: [transfer, quote, review, receipt, qa-playground]
automation_ingest: true
route: /testing-lab/money-transfer/transfer
```

## Story

**As a** QA engineer practicing fintech send-money journeys  
**I want** to complete a demo transfer from receiver through amount, review, and receipt  
**So that** I can test happy-path, validation, fees, promo codes, and tracking without real payouts

## Context

- Inspired by common send-money UX (destination, receiver, quote, review, receipt)
- No Western Union (or other provider) branding or real rails
- All amounts, FX, and tracking numbers are deterministic demo data
- Must be logged in

## Acceptance criteria

### AC-T01 — Start from dashboard
Given I am logged in  
When I click **Start Test Transfer**  
Then I am on `/money-transfer/transfer` with the amount/quote form and stepper

### AC-T02 — Seed receiver
Given I have continued from amount to receiver  
When I click a seed receiver chip (Priya / Carlos / Ana)  
Then country, payout, name, phone, and city are filled  
And I can continue without retyping

### AC-T03 — Receiver validation
When required receiver fields are blank or invalid  
Then Continue is blocked with field errors  
And I do not reach the amount step

### AC-T04 — Amount quote
Given I started a test transfer  
When I choose a destination country and enter a send amount in USD  
Then receive amount, FX rate, fee, and total debit update  
And receive field is read-only

### AC-T05 — Amount limits
When send amount is below $10, above $2000, or total debit exceeds test balance  
Then a clear error is shown and review is blocked

### AC-T06 — Promo TESTFEE0
When I enter promo `TESTFEE0`  
Then fee is $0.00  
When I enter an unknown promo  
Then an error is shown and continue is blocked

### AC-T07 — Review
Given valid receiver and amount  
When I continue  
Then review shows receiver, corridor, send, receive, fee, and total  
And Confirm is blocked until the demo-transfer checkbox is checked

### AC-T08 — Receipt
When I confirm  
Then a tracking number `DEMO##########` is created  
And I see a receipt with status, amounts, and parties  
And test balance decreases by total debit  
And the transfer appears on the dashboard list

### AC-T09 — Auth gate
When I am logged out  
Then transfer/receiver/review/receipt routes redirect to `/money-transfer`

### AC-T10 — Safety
No real payout, bank, or provider API is called  
Page remains labelled as a test environment

### AC-T11 — Automation hooks
Stable `data-testid` / `automation-id` exist for seed chips, fields, continue, confirm, receipt reference

## Out of scope

- Real payment instruments
- Live FX
- SMS notifications
