export const FIELD_LIMITS = {
  firstName: 50,
  lastName: 50,
  email: 100,
  phone: 20,
  identifier: 100,
  password: 64,
  otp: 6
};

const NAME_RE = /^[A-Za-z][A-Za-z\s'-]{1,49}$/;
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const PHONE_RE = /^\+[1-9]\d{9,14}$/;
const PASSWORD_RE = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,64}$/;

export function clampLength(value, max) {
  return String(value ?? '').slice(0, max);
}

export function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

/**
 * Normalize phones for lookup/storage.
 * - Strips spaces/dashes/parens
 * - 10-digit Indian mobiles (6–9…) become +91XXXXXXXXXX
 * - Bare 12-digit 91… become +91…
 */
export function normalizePhone(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  let digits = raw.replace(/\D/g, '');
  if (!digits) return '';

  if (digits.length === 10 && /^[6-9]/.test(digits)) {
    digits = `91${digits}`;
  }
  if (digits.length === 11 && digits.startsWith('0') && /^[6-9]/.test(digits.slice(1))) {
    digits = `91${digits.slice(1)}`;
  }
  if (digits.length >= 10 && digits.length <= 15) {
    return `+${digits}`;
  }
  return digits;
}

export function looksLikeEmail(value) {
  return String(value || '').includes('@');
}

export function validateName(value, label = 'Name') {
  const trimmed = String(value || '').trim();
  if (!trimmed) return `${label} is required.`;
  if (trimmed.length > FIELD_LIMITS.firstName) {
    return `${label} must be at most ${FIELD_LIMITS.firstName} characters.`;
  }
  if (!NAME_RE.test(trimmed)) {
    return `${label} must be 2–50 characters and may include letters, spaces, hyphens, and apostrophes.`;
  }
  return '';
}

export function validateEmail(value) {
  const raw = String(value || '').trim();
  if (!raw) return 'Email address is required.';
  if (raw.length > FIELD_LIMITS.email) {
    return `Email must be at most ${FIELD_LIMITS.email} characters.`;
  }
  const email = normalizeEmail(value);
  if (/\s/.test(raw) || !EMAIL_RE.test(email)) {
    return 'Invalid email address.';
  }
  return '';
}

export function validatePhone(value) {
  const raw = String(value || '').trim();
  if (!raw) return 'Mobile number is required.';
  if (raw.length > FIELD_LIMITS.phone) {
    return `Mobile number must be at most ${FIELD_LIMITS.phone} characters.`;
  }
  const phone = normalizePhone(value);
  if (!PHONE_RE.test(phone)) {
    return 'Invalid mobile number. Use a valid number (e.g. +919876543210 or 9876543210).';
  }
  return '';
}

export function validateIdentifier(value) {
  const raw = String(value || '').trim();
  if (!raw) return 'Email or mobile number is required.';
  if (raw.length > FIELD_LIMITS.identifier) {
    return `Must be at most ${FIELD_LIMITS.identifier} characters.`;
  }
  if (looksLikeEmail(raw)) {
    return validateEmail(raw);
  }
  return validatePhone(raw);
}

export function validateLoginPassword(value) {
  const password = String(value || '');
  if (!password) return 'Password is required.';
  if (password.length > FIELD_LIMITS.password) {
    return `Password must be at most ${FIELD_LIMITS.password} characters.`;
  }
  return '';
}

export function validateRegistrationPassword(value) {
  const password = String(value || '');
  if (!password) return 'Password is required.';
  if (password.length > FIELD_LIMITS.password) {
    return `Password must be at most ${FIELD_LIMITS.password} characters.`;
  }
  if (!PASSWORD_RE.test(password)) {
    return 'Password must be 8–64 characters and include uppercase, lowercase, and a number.';
  }
  return '';
}

export function passwordStrength(value) {
  const password = String(value || '');
  return {
    minLength: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password)
  };
}

export function validateConfirmPassword(password, confirm) {
  if (!String(confirm || '')) return 'Confirm password is required.';
  if (String(confirm).length > FIELD_LIMITS.password) {
    return `Password must be at most ${FIELD_LIMITS.password} characters.`;
  }
  if (password !== confirm) return 'Passwords do not match.';
  return '';
}

export function validateOtp(value) {
  const otp = String(value || '').replace(/\s/g, '');
  if (!otp) return 'Verification code is required.';
  if (!/^\d+$/.test(otp)) return 'Verification code must be numeric only.';
  if (otp.length !== FIELD_LIMITS.otp) {
    return `Verification code must be exactly ${FIELD_LIMITS.otp} digits.`;
  }
  return '';
}
