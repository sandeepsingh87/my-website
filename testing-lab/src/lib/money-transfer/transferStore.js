import { STARTING_BALANCE } from './transfer.js';

const DRAFT_KEY = 'mt-transfer-draft';
const HISTORY_KEY = 'mt-transfer-history';
const BALANCE_KEY = 'mt-transfer-balances';

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
    /* ignore */
  }
}

export function readDraft() {
  return readJson(sessionStorage, DRAFT_KEY, null);
}

export function writeDraft(draft) {
  writeJson(sessionStorage, DRAFT_KEY, draft);
}

export function clearDraft() {
  try {
    sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    /* ignore */
  }
}

export function readBalances() {
  const parsed = readJson(localStorage, BALANCE_KEY, {});
  return parsed && typeof parsed === 'object' ? parsed : {};
}

export function getBalance(userId) {
  const balances = readBalances();
  const value = Number(balances[userId]);
  return Number.isFinite(value) ? value : STARTING_BALANCE;
}

export function setBalance(userId, amount) {
  const balances = readBalances();
  balances[userId] = Number(amount);
  writeJson(localStorage, BALANCE_KEY, balances);
}

export function readHistory(userId) {
  const all = readJson(localStorage, HISTORY_KEY, {});
  const list = all?.[userId];
  return Array.isArray(list) ? list : [];
}

export function addTransfer(userId, transfer) {
  const all = readJson(localStorage, HISTORY_KEY, {});
  const list = Array.isArray(all[userId]) ? all[userId] : [];
  all[userId] = [transfer, ...list].slice(0, 20);
  writeJson(localStorage, HISTORY_KEY, all);
}

export function getTransfer(userId, reference) {
  return readHistory(userId).find((item) => item.reference === reference) || null;
}

export { DRAFT_KEY, HISTORY_KEY, BALANCE_KEY };
