# Test scenarios — Main Testing Lab

Route: `/testing-lab/`  
Locators: `automation-id` / `data-testid`  
Seed orders: ORD-1001 … ORD-1007

## Smoke

- [ ] Lab loads at `/testing-lab/` (trailing slash)
- [ ] `/testing-lab` redirects to `/testing-lab/`
- [ ] Strip shows TEST ENVIRONMENT
- [ ] Nav: Dashboard, Forms, Commerce, Workflow, Settings, Auth Lab
- [ ] Theme toggle persists after refresh (`qe-lab-theme`)
- [ ] Skip to content is keyboard-reachable

## Dashboard

- [ ] Metrics render (`card-active-tests`, `card-open-defects`, `card-automation-pass`, `card-deployments`)
- [ ] Checklist toggles update `txt-checklist-count` and `txt-release-health`
- [ ] Dismiss `note-defect` via `btn-note-dismiss-defect`; open defects drops
- [ ] `row-env-sbx` is down / 0%
- [ ] Flag copy appears when Settings flags are on

## Forms (`?view=forms`)

- [ ] Empty submit → `err-full-name`, `err-email`, `err-password`, `err-terms`
- [ ] Invalid email → `err-email`
- [ ] Mismatched confirm → `err-confirm-password`
- [ ] Password hints `hint-password-len|letter|number` turn ok as user types
- [ ] Notes counter `txt-notes-count` caps at 280
- [ ] Reject non PNG/PDF/TXT via `err-evidence-file`
- [ ] Valid save → `msg-profile-saved` + toast
- [ ] Reset clears fields and success banner

## Commerce (`?view=commerce`)

- [ ] Search ORD-1001 → one row `row-order-ord-1001`
- [ ] Status Shipped → only shipped rows
- [ ] Sort by total + Desc changes order
- [ ] Clear filters restores full list
- [ ] Empty search → `msg-orders-empty`
- [ ] Page 2 via `btn-page-next`
- [ ] View opens `dlg-order-details`; Escape and backdrop close it
- [ ] Ship on new order → status shipped; Ship disabled
- [ ] Cancel in modal on processing order → cancelled badge

## Workflow (`?view=workflow`)

- [ ] Empty name blocks Next
- [ ] Version `abc` blocks Next (`err-workflow`)
- [ ] Step 2/3 buttons disabled until gates pass
- [ ] Unchecked validation blocks Next
- [ ] Finish shows `msg-workflow-done` and disables Finish

## Settings (`?view=settings`)

- [ ] Accordion expand/collapse `btn-acc-api|flags|audit`
- [ ] Reveal / copy / regenerate API key (`txt-api-key` changes after regen)
- [ ] Flag toggles persist after refresh
- [ ] Audit list fills after profile save or ship
- [ ] Download report starts a `qe-lab-orders.csv` file
- [ ] Reset lab restores seed data
- [ ] Negative case: cancel leaves lab unchanged; confirm shows error toast

## Responsive / a11y

- [ ] <980px: hamburger `btn-menu-open`; Escape closes drawer
- [ ] Focus-visible ring on buttons and inputs
- [ ] Toasts have `role="status"` and `aria-live="polite"`

## Visual

- [ ] Sage canvas + lime primary (not the old blue hero)
- [ ] Auth Lab still lime/sage and compact strip
