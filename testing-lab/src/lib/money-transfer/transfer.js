import { clampLength, validateName, validatePhone } from './validation.js';

export const TRANSFER_LIMITS = {
  firstName: 50,
  lastName: 50,
  phone: 20,
  city: 40,
  promo: 20,
  amount: 10
};

export const MIN_SEND_USD = 10;
export const MAX_SEND_USD = 2000;
export const STARTING_BALANCE = 10000;
export const PROMO_ZERO_FEE = 'TESTFEE0';

export const CORRIDORS = [
  { code: 'IN', country: 'India', currency: 'INR', rate: 83.25, flagHint: 'IN' },
  { code: 'PH', country: 'Philippines', currency: 'PHP', rate: 56.4, flagHint: 'PH' },
  { code: 'MX', country: 'Mexico', currency: 'MXN', rate: 17.1, flagHint: 'MX' },
  { code: 'GB', country: 'United Kingdom', currency: 'GBP', rate: 0.79, flagHint: 'GB' }
];

export const PAYOUT_METHODS = [
  { id: 'bank', label: 'Bank deposit' },
  { id: 'cash', label: 'Cash pickup' }
];

export const SEED_RECEIVERS = [
  {
    id: 'recv-01',
    firstName: 'Priya',
    lastName: 'Sharma',
    country: 'IN',
    city: 'Mumbai',
    phone: '+919811122334',
    phoneDisplay: '+91 98111 22334',
    payoutMethod: 'bank'
  },
  {
    id: 'recv-02',
    firstName: 'Carlos',
    lastName: 'Reyes',
    country: 'MX',
    city: 'Mexico City',
    phone: '+525512345678',
    phoneDisplay: '+52 55123 45678',
    payoutMethod: 'cash'
  },
  {
    id: 'recv-03',
    firstName: 'Ana',
    lastName: 'Cruz',
    country: 'PH',
    city: 'Manila',
    phone: '+639171234567',
    phoneDisplay: '+63 91712 34567',
    payoutMethod: 'bank'
  }
];

export const emptyDraft = {
  country: 'IN',
  payoutMethod: 'bank',
  firstName: '',
  lastName: '',
  phone: '',
  city: '',
  sendAmount: '100',
  promo: ''
};

export function getCorridor(code) {
  return CORRIDORS.find((item) => item.code === code) || CORRIDORS[0];
}

export function parseAmount(value) {
  const n = Number(String(value || '').replace(/,/g, '').trim());
  return Number.isFinite(n) ? n : NaN;
}

export function formatMoney(amount, currency = 'USD') {
  const n = Number(amount);
  if (!Number.isFinite(n)) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(n);
}

export function quoteTransfer({ sendAmount, country, promo }) {
  const corridor = getCorridor(country);
  const send = parseAmount(sendAmount);
  const code = String(promo || '').trim().toUpperCase();
  const promoValid = code === PROMO_ZERO_FEE;
  const promoInvalid = Boolean(code) && !promoValid;
  const fee = promoValid ? 0 : send < 200 ? 4.99 : 8.99;
  const receive = send * corridor.rate;
  const totalDebit = send + fee;
  return {
    corridor,
    send,
    fee,
    receive,
    totalDebit,
    promo: code,
    promoValid,
    promoInvalid
  };
}

export function validateReceiver(draft) {
  const errors = {
    country: draft.country ? '' : 'Destination country is required.',
    payoutMethod: draft.payoutMethod ? '' : 'Payout method is required.',
    firstName: validateName(draft.firstName, 'First name'),
    lastName: validateName(draft.lastName, 'Last name'),
    phone: validatePhone(draft.phone),
    city: String(draft.city || '').trim()
      ? (String(draft.city).trim().length < 2 ? 'City must be at least 2 characters.' : '')
      : 'City is required.'
  };
  return errors;
}

export function validateAmount(draft, balance) {
  const quote = quoteTransfer(draft);
  const errors = { sendAmount: '', promo: '' };
  if (!Number.isFinite(quote.send)) {
    errors.sendAmount = 'Enter a valid amount.';
  } else if (quote.send < MIN_SEND_USD) {
    errors.sendAmount = `Minimum send amount is ${formatMoney(MIN_SEND_USD)}.`;
  } else if (quote.send > MAX_SEND_USD) {
    errors.sendAmount = `Maximum send amount is ${formatMoney(MAX_SEND_USD)}.`;
  } else if (quote.totalDebit > balance) {
    errors.sendAmount = `Insufficient test balance. Available ${formatMoney(balance)}.`;
  }
  if (quote.promoInvalid) {
    errors.promo = `Unknown promo code. Try ${PROMO_ZERO_FEE} to waive the demo fee.`;
  }
  return { errors, quote };
}

export function clampTransferField(key, value) {
  const max = TRANSFER_LIMITS[key];
  return max ? clampLength(value, max) : value;
}

export function createReference() {
  const stamp = String(Date.now()).slice(-10);
  return `DEMO${stamp}`;
}

export function payoutStatus(method) {
  return method === 'cash' ? 'Ready for cash pickup' : 'Deposited to test bank';
}
