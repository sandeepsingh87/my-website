# User Stories — Main Testing Lab

```yaml
id: US-QE-MAIN-001
title: Practice core QE surfaces in Testing Lab
module: main-lab
type: user-story
priority: P0
labels: [dashboard, forms, commerce, workflow, settings]
automation_ingest: true
route: /testing-lab/
```

## Story

**As a** QA engineer  
**I want** dashboard, forms, grid, workflow, and settings that behave like a small product  
**So that** I can practice functional, negative, and automation testing in a sandbox

## Acceptance criteria

### AC-D01 — Compact environment strip
Given I open `/testing-lab/`  
Then I see a one-line **TEST ENVIRONMENT** strip  
And I do not see a large marketing hero

### AC-D02 — Live release health
Given the release checklist has 2 of 4 items done  
Then **Release health** shows **50%**  
And **Automation pass** matches that percentage

### AC-D03 — Dismiss notification
Given the Defect triage notification is visible  
When I dismiss it  
Then **Open defects** decreases  
And the empty or remaining list updates

### AC-D04 — Sandbox environment
Given I view Environment Status  
Then Sandbox is **down** with 0% uptime (intentional negative fixture)

### AC-F01 — Required field errors
Given I am on `?view=forms`  
When I submit with empty name, email, password, and terms  
Then field errors appear  
And an error toast appears  
And the profile is not saved

### AC-F02 — Password rules
Given password is shorter than 8 characters or missing a letter/number  
When I submit  
Then `err-password` explains the rule

### AC-F03 — Confirm password
Given password and confirm password differ  
When I submit  
Then `err-confirm-password` shows **Passwords do not match**

### AC-F04 — Happy path save
Given valid name, email, matching password with letter+number, and terms checked  
When I click **Save profile**  
Then `msg-profile-saved` appears  
And a success toast includes the name

### AC-C01 — Filter and empty state
Given I am on `?view=commerce`  
When I search for `ZZZ-NONE`  
Then `msg-orders-empty` is shown  
And `txt-order-count` is **0 orders**

### AC-C02 — Pagination
Given 7 seed orders and page size 5  
Then page 1 lists 5 rows  
When I click **Next**  
Then page 2 lists the remaining rows

### AC-C03 — Ship lock
Given order ORD-1003 is shipped  
Then its **Ship** control is disabled  
And modal Process / Cancel are disabled

### AC-C04 — Clear filters
Given a search and status filter are applied  
When I click **Clear filters**  
Then search is empty, status is All, sort is ID ascending, page is 1

### AC-W01 — Gated next
Given I am on Workflow step 1  
When I clear the release name and click **Next**  
Then I stay on step 1  
And `err-workflow` is shown

### AC-W02 — Locked future step
Given I have not passed step 1  
Then **Validation** and **Confirmation** step buttons are disabled

### AC-W03 — Finish
Given I complete details, all validation checks, and open Confirmation  
When I click **Finish**  
Then `msg-workflow-done` appears  
And Finish is disabled

### AC-S01 — Copy API key
Given Settings → API keys  
When I click **Copy**  
Then a success toast appears (clipboard may be blocked in some browsers)

### AC-S02 — Feature flag
Given I enable **Beta dashboard copy**  
When I open Dashboard  
Then `txt-flag-beta-grid` is visible

### AC-S03 — Negative confirm
Given I click **Trigger negative case**  
When I confirm  
Then an error toast **Negative scenario triggered** appears

### AC-S04 — Reset lab
Given I changed order status and checklist  
When I click **Reset lab data**  
Then seed orders and checklist return  
And a toast **Lab data reset** appears

### AC-N01 — Deep link
Given I open `/testing-lab/?view=settings`  
Then Settings is the active view  
And the document title contains Settings
