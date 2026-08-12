const KEYS = {
  theme: 'qe-lab-theme',
  flags: 'qe-lab-flags',
  checklist: 'qe-lab-checklist',
  orders: 'qe-lab-orders'
};

function readJson(storage, key, fallback) {
  try {
    const raw = storage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJson(storage, key, value) {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode / quota */
  }
}

export function readTheme() {
  try {
    return localStorage.getItem(KEYS.theme) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function writeTheme(theme) {
  try {
    localStorage.setItem(KEYS.theme, theme);
  } catch {
    /* ignore */
  }
}

export function readFlags(fallback) {
  return readJson(localStorage, KEYS.flags, fallback);
}

export function writeFlags(flags) {
  writeJson(localStorage, KEYS.flags, flags);
}

export function readChecklist(fallback) {
  return readJson(sessionStorage, KEYS.checklist, fallback);
}

export function writeChecklist(items) {
  writeJson(sessionStorage, KEYS.checklist, items);
}

export function readOrders(fallback) {
  return readJson(sessionStorage, KEYS.orders, fallback);
}

export function writeOrders(orders) {
  writeJson(sessionStorage, KEYS.orders, orders);
}

export function clearLabSession() {
  try {
    sessionStorage.removeItem(KEYS.checklist);
    sessionStorage.removeItem(KEYS.orders);
  } catch {
    /* ignore */
  }
}

export { KEYS };
