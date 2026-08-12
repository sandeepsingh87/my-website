import { DEMO_OTP, TEST_USERS, formatPhoneDisplay } from './testUsers.js';
import {
  looksLikeEmail,
  normalizeEmail,
  normalizePhone,
  validateConfirmPassword,
  validateEmail,
  validateName,
  validateOtp,
  validatePhone,
  validateRegistrationPassword
} from './validation.js';
import {
  clearRememberedUserId,
  clearSession,
  readRegisteredUsers,
  readRememberedUserId,
  readSession,
  writeRegisteredUsers,
  writeRememberedUserId,
  writeSession
} from './session.js';

function delay(ms = 350) {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });
}

function allUsers() {
  return [...TEST_USERS, ...readRegisteredUsers()];
}

function findByIdentifier(identifier) {
  const raw = String(identifier || '').trim();
  if (!raw) return null;
  if (looksLikeEmail(raw)) {
    const email = normalizeEmail(raw);
    return allUsers().find((user) => user.email === email) || null;
  }
  const phone = normalizePhone(raw);
  if (!phone) return null;
  return allUsers().find((user) => normalizePhone(user.phone) === phone) || null;
}

export function restorePersistedAuth() {
  const session = readSession();
  if (session?.userId) {
    const user = getUserById(session.userId);
    if (user) return { user: publicUser(user), session };
  }

  const rememberedId = readRememberedUserId();
  if (!rememberedId) return { user: null, session: null };

  const remembered = getUserById(rememberedId);
  if (!remembered) {
    clearRememberedUserId();
    return { user: null, session: null };
  }

  const restored = {
    authenticated: true,
    userId: remembered.id,
    authMethod: 'password',
    createdAt: new Date().toISOString()
  };
  writeSession(restored);
  return { user: publicUser(remembered), session: restored };
}

export function getCurrentSession() {
  return readSession();
}

export function getRememberedUserId() {
  return readRememberedUserId();
}

export function getUserById(userId) {
  return allUsers().find((user) => user.id === userId) || null;
}

export function getSeedUsers() {
  return TEST_USERS;
}

export async function loginWithPassword({ identifier, password, rememberMe }) {
  await delay();
  const user = findByIdentifier(identifier);
  if (!user || user.password !== password) {
    return {
      ok: false,
      error: 'Invalid test credentials. Please use one of the credentials provided in the Test Credentials panel.'
    };
  }

  const session = {
    authenticated: true,
    userId: user.id,
    authMethod: 'password',
    createdAt: new Date().toISOString()
  };
  writeSession(session);
  if (rememberMe) writeRememberedUserId(user.id);
  else clearRememberedUserId();

  return { ok: true, session, user: publicUser(user) };
}

/**
 * Only known sandbox accounts can request OTP (realistic for this lab).
 * Invalid format is rejected by the form before this runs.
 */
export async function sendOtp({ identifier }) {
  await delay(250);
  const user = findByIdentifier(identifier);
  if (!user) {
    return {
      ok: false,
      error: 'No test account found for this email or mobile. Use an account from the Test Credentials panel.'
    };
  }
  return {
    ok: true,
    knownUser: true,
    message: 'Demo OTP ready. Enter the 6-digit code from the Test Credentials panel.'
  };
}

export async function loginWithOtp({ identifier, otp, rememberMe = false }) {
  await delay();
  const cleanedOtp = String(otp || '').replace(/\s/g, '');
  const formatError = validateOtp(cleanedOtp);
  if (formatError) {
    return { ok: false, error: formatError };
  }
  if (cleanedOtp !== DEMO_OTP) {
    return {
      ok: false,
      error: 'Invalid verification code. Please enter the 6-digit demo OTP (147272).'
    };
  }
  const user = findByIdentifier(identifier);
  if (!user) {
    return {
      ok: false,
      error: 'No test account found for this email or mobile. Use an account from the Test Credentials panel.'
    };
  }

  const session = {
    authenticated: true,
    userId: user.id,
    authMethod: 'otp',
    createdAt: new Date().toISOString()
  };
  writeSession(session);
  if (rememberMe) writeRememberedUserId(user.id);
  else clearRememberedUserId();

  return { ok: true, session, user: publicUser(user) };
}

export async function registerAccount(payload) {
  await delay();

  const errors = {
    firstName: validateName(payload.firstName, 'First name'),
    lastName: validateName(payload.lastName, 'Last name'),
    email: validateEmail(payload.email),
    phone: validatePhone(payload.phone),
    password: validateRegistrationPassword(payload.password),
    confirmPassword: validateConfirmPassword(payload.password, payload.confirmPassword),
    terms: payload.terms ? '' : 'You must accept the test/demo account terms.'
  };

  const hasErrors = Object.values(errors).some(Boolean);
  if (hasErrors) {
    return { ok: false, fieldErrors: errors, error: 'Please fix the highlighted fields.' };
  }

  const email = normalizeEmail(payload.email);
  const phone = normalizePhone(payload.phone);
  const existing = allUsers();

  if (existing.some((user) => user.email === email)) {
    return {
      ok: false,
      fieldErrors: { ...errors, email: 'An account with this email already exists in the test environment.' },
      error: 'An account with this email already exists in the test environment.'
    };
  }
  if (existing.some((user) => normalizePhone(user.phone) === phone)) {
    return {
      ok: false,
      fieldErrors: { ...errors, phone: 'An account with this mobile number already exists in the test environment.' },
      error: 'An account with this mobile number already exists in the test environment.'
    };
  }

  const user = {
    id: `registered-${Date.now()}`,
    firstName: String(payload.firstName).trim(),
    lastName: String(payload.lastName).trim(),
    email,
    phone,
    phoneDisplay: formatPhoneDisplay(phone),
    password: payload.password,
    otp: DEMO_OTP,
    source: 'registered'
  };

  const registered = readRegisteredUsers();
  registered.push(user);
  writeRegisteredUsers(registered);

  return { ok: true, user: publicUser(user) };
}

export function logout() {
  clearSession();
  clearRememberedUserId();
}

export function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    phoneDisplay: user.phoneDisplay || formatPhoneDisplay(user.phone),
    source: user.source
  };
}
