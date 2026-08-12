const SESSION_KEY = 'mt-auth-session';
const REMEMBER_KEY = 'mt-auth-remember-user-id';
const REGISTERED_KEY = 'mt-auth-registered-users';
const THEME_KEY = 'mt-auth-theme';

function readJson(storage, key, fallback) {
  try {
    const raw = storage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function readSession() {
  try {
    const parsed = readJson(sessionStorage, SESSION_KEY, null);
    if (!parsed?.authenticated || !parsed?.userId) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeSession(session) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    /* private mode / quota */
  }
}

export function clearSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

export function readRememberedUserId() {
  try {
    return localStorage.getItem(REMEMBER_KEY) || '';
  } catch {
    return '';
  }
}

export function writeRememberedUserId(userId) {
  try {
    if (userId) localStorage.setItem(REMEMBER_KEY, userId);
    else localStorage.removeItem(REMEMBER_KEY);
  } catch {
    /* ignore quota / private mode */
  }
}

export function clearRememberedUserId() {
  writeRememberedUserId('');
}

export function readRegisteredUsers() {
  const parsed = (() => {
    try {
      return readJson(localStorage, REGISTERED_KEY, []);
    } catch {
      return [];
    }
  })();
  return Array.isArray(parsed) ? parsed : [];
}

export function writeRegisteredUsers(users) {
  try {
    localStorage.setItem(REGISTERED_KEY, JSON.stringify(users));
  } catch {
    /* ignore */
  }
}

export function readTheme() {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return value === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function writeTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme === 'dark' ? 'dark' : 'light');
  } catch {
    /* ignore */
  }
}

export { SESSION_KEY, REMEMBER_KEY, REGISTERED_KEY, THEME_KEY };
