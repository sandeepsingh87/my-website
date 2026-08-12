# Engineering — Money Transfer Authentication Lab

## Stack

- Vite + React 18 (same app as QE Testing Lab)
- `react-router-dom` v6 — basename `/testing-lab`
- Client-only mock auth (no network calls for credentials)
- Styles: shared `app.css` tokens + `money-transfer.css`

## Routes

| Path | Page |
|------|------|
| `/testing-lab/` | Existing QE lab (`QeLabApp`) |
| `/testing-lab/money-transfer` | Login / dashboard |
| `/testing-lab/money-transfer/transfer` | Amount + quote (auth required) |
| `/testing-lab/money-transfer/receiver` | Receiver |
| `/testing-lab/money-transfer/review` | Review + confirm |
| `/testing-lab/money-transfer/receipt/:ref` | Demo receipt |

Nav: **Auth Lab** link on both shells.

## Visual design

Auth Lab uses a **scoped** fintech theme (class `mt-theme`) inspired by the Wise entry in [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) (`design-md/wise/DESIGN.md`):

- Sage / soft-green canvas with lime primary CTAs
- Plus Jakarta Sans (page-scoped; main QE lab unchanged)
- Large radius cards, soft shadows, high-contrast ink
- Dark mode supported via existing theme toggle

**Not** a Wise clone: no Wise logo, name, or trademarked assets. Safety banner remains mandatory.

### Credentials UI (overflow fix)

Test credentials use a **stacked card list** (not a wide actions table). Copy controls are compact pill buttons (`copy-email-user-01`, `copy-phone-user-01`, `copy-password`, `copy-otp`) that wrap on narrow viewports. Email/phone text uses `overflow-wrap: anywhere`.

## Source layout

```text
testing-lab/src/
  main.jsx                          # BrowserRouter + routes
  pages/QeLabApp.jsx
  pages/MoneyTransferLab.jsx
  lib/money-transfer/
    testUsers.js
    validation.js
    session.js
    moneyTransferAuth.js
    tid.js
  components/money-transfer/*
  styles/money-transfer.css
```

## Auth architecture

```text
UI → moneyTransferAuth → seed users + localStorage registered users
                      → sessionStorage session
                      → localStorage remember userId (optional)
```

### Storage keys

| Key | Storage | Contents |
|-----|---------|----------|
| `mt-auth-session` | sessionStorage | `{ authenticated, userId, authMethod, createdAt }` |
| `mt-auth-remember-user-id` | localStorage | user id string only (never password/OTP) |
| `mt-auth-registered-users` | localStorage | array of locally registered demo users |
| `mt-auth-theme` | localStorage | `light` or `dark` |

Remember Me: if checked at login, reopening the lab restores the dashboard from `userId` until Logout (Logout clears session + remembered id).

### Seed users

| id | email | phone | password | otp |
|----|-------|-------|----------|-----|
| test-user-01 | testuser01@example.com | +919876543210 | Welcome123 | 147272 |
| test-user-02 | testuser02@example.com | +919812345678 | Welcome123 | 147272 |
| test-user-03 | testuser03@example.com | +919711223344 | Welcome123 | 147272 |

### Validation (summary)

- Name: `^[A-Za-z][A-Za-z\s'-]{1,49}$` (max 50; `maxLength` enforced)
- Email: standard lab regex; trimmed + lowercased for lookup (max 100)
- Phone: normalized then `^\+[1-9]\d{9,14}$` (max input length 20; 10-digit Indian mobiles get `+91`)
- Registration password: 8–64 chars, upper + lower + digit
- Login identifier: max 100 characters
- OTP: exactly 6 digits; only `147272` accepted

Seed phones use memorable patterns (e.g. `+91 98765 43210`) — not long zero runs — so manual testers can type them quickly.

### OTP send behavior

`Send OTP` requires a **known** sandbox account (seed or locally registered). Invalid format stays on the identifier step. Unknown email/phone shows an inline error and does **not** advance to the OTP entry step.

Phone lookup accepts:
- `+919876543210`
- `+91 98765 43210`
- `9876543210` (normalized to `+91…` for Indian 10-digit mobiles)

### Toast feedback

Auth Lab toasts use `mt-toast-success` / `mt-toast-error` with explicit white text on teal/red backgrounds (avoids blank “white on white” toasts).

### Security principles

- Never log passwords or OTPs
- Never call external auth/SMS/email/banking
- Never store passwords in localStorage
- Public demo credentials are intentional for QA

## Locator contract

Every interactive control uses **both**:

```html
automation-id="…"
data-testid="…"
```

Same value (spec IDs). Helper: `tid(id)` in `lib/money-transfer/tid.js`.

Primary login/register IDs: `login-identifier`, `login-password`, `login-submit`, `otp-send`, `otp-verify`, `register-submit`, `dashboard-logout`, `dashboard-start-transfer`.

Transfer IDs: `transfer-seed-recv-01`, `transfer-country`, `transfer-first-name`, `transfer-send-amount`, `transfer-promo`, `transfer-confirm`, `transfer-confirm-submit`, `receipt-reference`.

## Demo transfer engine

Files: `lib/money-transfer/transfer.js`, `transferStore.js`.

| Item | Demo rule |
|------|-----------|
| Starting balance | $10,000.00 per user (`mt-transfer-balances`) |
| Min / max send | $10 / $2,000 |
| Fee | $4.99 if send &lt; $200, else $8.99 |
| Promo `TESTFEE0` | Fee $0 |
| FX | Fixed: INR 83.25, PHP 56.40, MXN 17.10, GBP 0.79 |
| Tracking | `DEMO` + 10 digits |
| Draft | `sessionStorage` `mt-transfer-draft` |
| History | `localStorage` `mt-transfer-history` |

Seed receivers: Priya Sharma (IN bank), Carlos Reyes (MX cash), Ana Cruz (PH bank).

Unauthenticated visits to transfer routes redirect to `/money-transfer`.

## Local development

```sh
cd testing-lab
npm install
npm run dev
```

- Main lab: http://localhost:5173/testing-lab/
- Auth lab: http://localhost:5173/testing-lab/money-transfer

## Build / preview

```sh
npm run build
npm run preview
```

## Static publish

```sh
npm run publish:static
```

Builds assets, updates `testing-lab/index.html`, and copies SPA entry to `testing-lab/money-transfer/index.html` for deep-link refresh on static hosts.

On Windows PowerShell, prefer Git Bash for `publish:static`, or use `npm run preview` for local verification without publishing.
