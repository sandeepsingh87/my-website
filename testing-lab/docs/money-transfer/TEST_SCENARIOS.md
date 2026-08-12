# Test Scenarios — Money Transfer Authentication Lab

```yaml
module: money-transfer
route: /testing-lab/money-transfer
automation_ingest: true
user_stories:
  - US-MT-LOGIN-001
  - US-MT-REG-001
  - US-MT-TRANSFER-001
seed:
  password: Welcome123
  otp: "147272"
  users:
    - id: test-user-01
      email: testuser01@example.com
      phone: "+919876543210"
```

Use these scenarios for manual exploratory/functional testing.  
Future automation frameworks can parse each `## TC-*` block (id, maps_to, steps, data, expected, locators).

---

## TC-LOGIN-001

```yaml
id: TC-LOGIN-001
title: Login using valid test email + password
maps_to: [AC-L01]
type: happy
priority: P0
```

**Preconditions:** Logged out; Auth Lab open  
**Data:** email=`testuser01@example.com`, password=`Welcome123`  
**Steps:**
1. Open `/testing-lab/money-transfer`
2. Select Password Login tab
3. Enter email and password
4. Click Log in

**Expected:** Dashboard visible; welcome shows Test User 01  
**Locators:** `login-tab-password`, `login-identifier`, `login-password`, `login-submit`, `dashboard`

---

## TC-LOGIN-002

```yaml
id: TC-LOGIN-002
title: Login using valid test phone + password
maps_to: [AC-L02]
type: happy
priority: P0
```

**Data:** phone=`+919876543210`, password=`Welcome123`  
**Steps:** Password tab → enter phone + password → Log in  
**Expected:** Dashboard  
**Locators:** `login-identifier`, `login-password`, `login-submit`, `dashboard`

---

## TC-LOGIN-003

```yaml
id: TC-LOGIN-003
title: Login using valid test email + OTP
maps_to: [AC-L03]
type: happy
priority: P0
```

**Data:** email=`testuser01@example.com`, otp=`147272`  
**Steps:** OTP tab → identifier → Send OTP → enter OTP → Verify OTP  
**Expected:** Dashboard  
**Locators:** `login-tab-otp`, `otp-identifier`, `otp-send`, `otp-input`, `otp-verify`, `dashboard`

---

## TC-LOGIN-004

```yaml
id: TC-LOGIN-004
title: Login using valid test phone + OTP
maps_to: [AC-L04]
type: happy
priority: P0
```

**Data:** phone=`+919812345678`, otp=`147272`  
**Expected:** Dashboard  
**Locators:** `otp-identifier`, `otp-send`, `otp-verify`, `dashboard`

---

## TC-LOGIN-005

```yaml
id: TC-LOGIN-005
title: Invalid password
maps_to: [AC-L05]
type: negative
priority: P0
```

**Data:** email=`testuser01@example.com`, password=`WrongPass1`  
**Expected:** Error on `login-error`; stay logged out; no dashboard  
**Message contains:** Invalid test credentials

---

## TC-LOGIN-006

```yaml
id: TC-LOGIN-006
title: Unknown email
maps_to: [AC-L06]
type: negative
priority: P0
```

**Data:** email=`unknown@example.com`, password=`Welcome123`  
**Expected:** Same generic invalid-credentials error; no existence leak

---

## TC-LOGIN-007

```yaml
id: TC-LOGIN-007
title: Unknown phone
maps_to: [AC-L06]
type: negative
priority: P1
```

**Data:** phone=`+919999999999`, password=`Welcome123`  
**Expected:** Generic invalid-credentials error

---

## TC-LOGIN-008

```yaml
id: TC-LOGIN-008
title: Malformed email
maps_to: [AC-L07]
type: negative
priority: P1
```

**Data:** identifier=`abc@`, password=`Welcome123`  
**Expected:** Validation error before auth; no dashboard

---

## TC-LOGIN-009

```yaml
id: TC-LOGIN-009
title: Malformed phone
maps_to: [AC-L07]
type: negative
priority: P1
```

**Data:** identifier=`123`, password=`Welcome123`  
**Expected:** Validation error for mobile format

---

## TC-LOGIN-010

```yaml
id: TC-LOGIN-010
title: Blank identifier
maps_to: [AC-L07]
type: negative
priority: P0
```

**Data:** identifier empty, password=`Welcome123`  
**Expected:** Required-field validation

---

## TC-LOGIN-011

```yaml
id: TC-LOGIN-011
title: Blank password
maps_to: [AC-L07]
type: negative
priority: P0
```

**Data:** email=`testuser01@example.com`, password empty  
**Expected:** Password required validation

---

## TC-OTP-001

```yaml
id: TC-OTP-001
title: Correct OTP 147272
maps_to: [AC-L03, AC-L08]
type: happy
priority: P0
```

**Data:** seeded email + otp=`147272`  
**Expected:** Dashboard

---

## TC-OTP-002

```yaml
id: TC-OTP-002
title: Incorrect OTP
maps_to: [AC-L08]
type: negative
priority: P0
```

**Data:** otp=`000000`  
**Expected:** `otp-error` — Invalid verification code…

---

## TC-OTP-003

```yaml
id: TC-OTP-003
title: 5 digit OTP
maps_to: [AC-L08]
type: negative
priority: P1
```

**Data:** otp=`14727`  
**Expected:** Validation — must be exactly 6 digits

---

## TC-OTP-004

```yaml
id: TC-OTP-004
title: 7 digit OTP
maps_to: [AC-L08]
type: negative
priority: P1
```

**Data:** attempt otp longer than 6 (UI should constrain; if submitted invalid length → error)  
**Expected:** Rejected / not verified

---

## TC-OTP-005

```yaml
id: TC-OTP-005
title: Alphabetic OTP
maps_to: [AC-L08]
type: negative
priority: P1
```

**Data:** letters attempted in OTP boxes  
**Expected:** Non-numeric rejected (inputs filter digits) / validation error if forced

---

## TC-OTP-006

```yaml
id: TC-OTP-006
title: Blank OTP
maps_to: [AC-L08]
type: negative
priority: P0
```

**Expected:** Verification code required / invalid

---

## TC-OTP-007

```yaml
id: TC-OTP-007
title: Unknown user blocked at Send OTP
maps_to: [AC-L03b, AC-L09]
type: negative
priority: P0
```

**Data:** email=`nobody@example.com` or phone=`9999999999`  
**Steps:** OTP tab → enter unknown identifier → Send OTP  
**Expected:** Stay on identifier step; `otp-error` / field message about no test account; OTP boxes not shown

---

## TC-OTP-008

```yaml
id: TC-OTP-008
title: Readable toast on OTP success and failure
maps_to: [AC-L03]
type: happy
priority: P1
```

**Expected:** Toast text is visible (teal success / red error). Never a blank white toast.

---

## TC-REG-001

```yaml
id: TC-REG-001
title: Valid registration
maps_to: [AC-R01, AC-R02]
type: happy
priority: P0
```

**Data (unique each run):**
- firstName=`Ada`, lastName=`Lovelace`
- email=`ada.{timestamp}@example.com`
- phone=`+91900000` + unique 4 digits (not seed)
- password=`Welcome123`, confirm same, terms checked

**Expected:** `register-success` with email/phone; Go to Login available

---

## TC-REG-002

```yaml
id: TC-REG-002
title: Invalid email
maps_to: [AC-R05]
type: negative
priority: P0
```

**Data:** email=`abc@`  
**Expected:** Invalid email; no success

---

## TC-REG-003

```yaml
id: TC-REG-003
title: Invalid phone
maps_to: [AC-R06]
type: negative
priority: P0
```

**Data:** phone=`abcd` or `123`  
**Expected:** Invalid mobile message

---

## TC-REG-004

```yaml
id: TC-REG-004
title: Weak password
maps_to: [AC-R07]
type: negative
priority: P0
```

**Data:** password=`welcome`  
**Expected:** Strength validation failure

---

## TC-REG-005

```yaml
id: TC-REG-005
title: Password mismatch
maps_to: [AC-R08]
type: negative
priority: P0
```

**Data:** password=`Welcome123`, confirm=`Welcome124`  
**Expected:** Passwords do not match.

---

## TC-REG-006

```yaml
id: TC-REG-006
title: Missing first name
maps_to: [AC-R04]
type: negative
priority: P1
```

**Expected:** First name required / invalid

---

## TC-REG-007

```yaml
id: TC-REG-007
title: Missing last name
maps_to: [AC-R04]
type: negative
priority: P1
```

**Expected:** Last name required / invalid

---

## TC-REG-008

```yaml
id: TC-REG-008
title: Terms unchecked
maps_to: [AC-R09]
type: negative
priority: P0
```

**Expected:** Terms error; submit blocked

---

## TC-REG-009

```yaml
id: TC-REG-009
title: Duplicate email
maps_to: [AC-R10]
type: negative
priority: P0
```

**Data:** email=`testuser01@example.com` (seed) with otherwise valid unique phone  
**Expected:** Duplicate email error

---

## TC-REG-010

```yaml
id: TC-REG-010
title: Duplicate phone
maps_to: [AC-R11]
type: negative
priority: P0
```

**Data:** phone=`+919876543210`, unique email  
**Expected:** Duplicate phone error

---

## TC-REG-011

```yaml
id: TC-REG-011
title: Newly registered user can log in
maps_to: [AC-R03]
type: happy
priority: P0
```

**Steps:** Complete TC-REG-001 → Go to Login → password login with new credentials  
**Expected:** Dashboard for new user name

---

## TC-SESSION-001

```yaml
id: TC-SESSION-001
title: Successful login reaches dashboard
maps_to: [AC-L01, AC-L12]
type: happy
priority: P0
```

**Expected:** `dashboard`, `dashboard-user-name`, `dashboard-logout`, `dashboard-start-transfer` present

---

## TC-SESSION-002

```yaml
id: TC-SESSION-002
title: Logout clears session
maps_to: [AC-L12]
type: happy
priority: P0
```

**Steps:** Login → Logout  
**Expected:** Login UI returns; reload does not restore dashboard (session cleared)

---

## TC-SESSION-003

```yaml
id: TC-SESSION-003
title: Authenticated user revisiting route remains logged in
maps_to: [AC-L13]
type: happy
priority: P1
```

**Steps:** Login → reload same tab  
**Expected:** Still on dashboard

---

## TC-SESSION-004

```yaml
id: TC-SESSION-004
title: Remember Me behavior
maps_to: [AC-L11]
type: happy
priority: P1
```

**Steps:** Check Remember Me → login → close tab / reload  
**Expected:** Dashboard restored. `mt-auth-remember-user-id` set; no password/OTP in localStorage. Logout then reload → login screen.

---

## TC-REG-012

```yaml
id: TC-REG-012
title: Field length caps prevent unbounded input
maps_to: [AC-R07b]
type: negative
priority: P1
```

**Steps:** Attempt to type/paste beyond max lengths on name (50), email (100), phone (16), password (64), OTP (6)  
**Expected:** Input capped at maxLength; no horizontal layout breakage from oversized values

---

## TC-MISC-001 — Forgot password message

```yaml
id: TC-MISC-001
maps_to: [AC-L10]
```

Click `login-forgot-password` → message states reset unavailable; use Test Credentials.

---

## TC-MISC-002 — Test credentials copy

```yaml
id: TC-MISC-002
```

Open credentials panel → use pill **Copy email** / **Copy phone** / **Copy password** / **Copy OTP** buttons  
→ toast / Copied feedback; clipboard holds normalized values.  
On narrow viewports, actions wrap under the user badge (no horizontal overflow).

---

## TC-TX-001

```yaml
id: TC-TX-001
title: Happy-path transfer to receipt using seed receiver
maps_to: [AC-T01, AC-T02, AC-T04, AC-T07, AC-T08]
type: happy
priority: P0
```

**Preconditions:** Logged in as Test User 01  
**Steps:**
1. Click Start Test Transfer
2. Choose India (or keep default) and amount `100`
3. Continue to receiver
4. Click Use Priya Sharma
5. Continue to review
6. Check demo-transfer checkbox
7. Confirm test transfer

**Expected:** Receipt with `DEMO` tracking number; they receive INR; dashboard balance reduced; transaction listed  
**Locators:** `dashboard-start-transfer`, `transfer-seed-recv-01`, `transfer-receiver-continue`, `transfer-amount-continue`, `transfer-confirm`, `transfer-confirm-submit`, `transfer-receipt`, `receipt-reference`

---

## TC-TX-002

```yaml
id: TC-TX-002
title: Receiver validation blocks continue
maps_to: [AC-T03]
type: negative
priority: P0
```

**Steps:** Open transfer with empty names → Continue  
**Expected:** Field errors; stay on receiver step

---

## TC-TX-003

```yaml
id: TC-TX-003
title: Amount below minimum
maps_to: [AC-T05]
type: negative
priority: P0
```

**Data:** sendAmount=`5`  
**Expected:** Minimum send amount error

---

## TC-TX-004

```yaml
id: TC-TX-004
title: Promo TESTFEE0 waives fee
maps_to: [AC-T06]
type: happy
priority: P0
```

**Data:** sendAmount=`100`, promo=`TESTFEE0`  
**Expected:** Fee $0.00; total debit equals send amount

---

## TC-TX-005

```yaml
id: TC-TX-005
title: Unknown promo blocked
maps_to: [AC-T06]
type: negative
priority: P1
```

**Data:** promo=`FREE99`  
**Expected:** Unknown promo error; cannot continue

---

## TC-TX-006

```yaml
id: TC-TX-006
title: Confirm checkbox required
maps_to: [AC-T07]
type: negative
priority: P0
```

**Steps:** Reach review → Confirm without checkbox  
**Expected:** Error; no receipt

---

## TC-TX-007

```yaml
id: TC-TX-007
title: Logged-out user cannot open transfer routes
maps_to: [AC-T09]
type: negative
priority: P0
```

**Steps:** Logout → open `/testing-lab/money-transfer/transfer`  
**Expected:** Redirect to login

---

## Manual smoke checklist (quick)

- [ ] TC-LOGIN-001
- [ ] TC-LOGIN-002
- [ ] TC-LOGIN-003
- [ ] TC-LOGIN-005
- [ ] TC-OTP-002
- [ ] TC-REG-001
- [ ] TC-REG-009
- [ ] TC-SESSION-002
- [ ] TC-TX-001
- [ ] TC-TX-004
- [ ] Compact test-environment strip (1–2 lines) above Sign in
- [ ] Responsive: 375px stacked layout, credentials cards readable, no horizontal scroll
- [ ] Visual: Auth Lab theme (lime CTA / sage canvas) loads; main lab at `/` unchanged
