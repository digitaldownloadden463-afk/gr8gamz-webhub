'use client';

import { useSyncExternalStore } from 'react';

export type ConsentChoice = 'accepted' | 'rejected';
export type ConsentSnapshot = ConsentChoice | null | 'unknown';

const legacyStorageKey = 'gr8:privacy-consent';
const storageKey = 'gr8:privacy-consent:v1';
const cookieName = 'gr8_consent';
const version = 'v1';
const maxAgeSeconds = 60 * 60 * 24 * 180;
const eventName = 'gr8-consent-change';

let memoryChoice: ConsentChoice | null = null;
const listeners = new Set<() => void>();
let channel: BroadcastChannel | null = null;

function isChoice(value: unknown): value is ConsentChoice {
  return value === 'accepted' || value === 'rejected';
}

function parseStored(value: string | null | undefined): ConsentChoice | null {
  if (!value) return null;
  if (isChoice(value)) return value;
  const [storedVersion, choice] = String(value).split('.');
  return storedVersion === version && isChoice(choice) ? choice : null;
}

function safeLocalStorageGet(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeLocalStorageSet(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function safeCookieRead() {
  try {
    return document.cookie
      .split(';')
      .map((item) => item.trim())
      .find((item) => item.startsWith(`${cookieName}=`))
      ?.slice(cookieName.length + 1) || null;
  } catch {
    return null;
  }
}

function safeCookieWrite(choice: ConsentChoice) {
  try {
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${cookieName}=${version}.${choice}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`;
    return true;
  } catch {
    return false;
  }
}

function readPersistedChoice(): ConsentChoice | null {
  if (typeof window === 'undefined') return null;
  if (memoryChoice) return memoryChoice;

  const fromExternal = readExternalChoice();
  if (fromExternal) {
    memoryChoice = fromExternal;
    if (!parseStored(safeCookieRead())) safeCookieWrite(fromExternal);
    if (!parseStored(safeLocalStorageGet(storageKey))) safeLocalStorageSet(storageKey, `${version}.${fromExternal}`);
    return fromExternal;
  }

  return memoryChoice;
}

function readExternalChoice(): ConsentChoice | null {
  const fromCookie = parseStored(safeCookieRead());
  if (fromCookie) {
    return fromCookie;
  }

  const fromStorage = parseStored(safeLocalStorageGet(storageKey)) || parseStored(safeLocalStorageGet(legacyStorageKey));
  if (fromStorage) {
    return fromStorage;
  }

  return null;
}

function syncFromExternalChoice() {
  const next = readExternalChoice();
  if (next && next !== memoryChoice) {
    memoryChoice = next;
    for (const storedListener of listeners) storedListener();
  }
}

function emitConsentChange() {
  for (const listener of listeners) listener();
  try {
    window.dispatchEvent(new CustomEvent(eventName, { detail: memoryChoice }));
  } catch {}
  try {
    channel?.postMessage(memoryChoice);
  } catch {}
}

export function getConsentChoice(): ConsentChoice | null {
  return readPersistedChoice();
}

export function setConsentChoice(choice: ConsentChoice) {
  memoryChoice = choice;
  safeCookieWrite(choice);
  safeLocalStorageSet(storageKey, `${version}.${choice}`);
  safeLocalStorageSet(legacyStorageKey, choice);
  emitConsentChange();
}

export function subscribeConsentChoice(listener: () => void) {
  listeners.add(listener);
  const notify = () => listener();
  const storageNotify = (event: StorageEvent) => {
    if (event.key === storageKey || event.key === legacyStorageKey) {
      const next = parseStored(event.newValue);
      if (next) memoryChoice = next;
    }
    listener();
  };
  if (!channel && typeof BroadcastChannel !== 'undefined') {
    try {
      channel = new BroadcastChannel(eventName);
      channel.addEventListener('message', (event) => {
        if (isChoice(event.data)) {
          memoryChoice = event.data;
          for (const storedListener of listeners) storedListener();
        }
      });
    } catch {
      channel = null;
    }
  }
  try {
    window.addEventListener(eventName, notify);
    window.addEventListener('storage', storageNotify);
  } catch {}
  const interval = window.setInterval(syncFromExternalChoice, 1000);
  const focusNotify = () => syncFromExternalChoice();
  try {
    window.addEventListener('focus', focusNotify);
    document.addEventListener('visibilitychange', focusNotify);
  } catch {}
  return () => {
    listeners.delete(listener);
    try {
      window.removeEventListener(eventName, notify);
      window.removeEventListener('storage', storageNotify);
      window.removeEventListener('focus', focusNotify);
      document.removeEventListener('visibilitychange', focusNotify);
    } catch {}
    window.clearInterval(interval);
  };
}

export function getConsentSnapshot(): ConsentSnapshot {
  return getConsentChoice();
}

export function getServerConsentSnapshot(): ConsentSnapshot {
  return 'unknown';
}

export function useConsentChoice() {
  return useSyncExternalStore(subscribeConsentChoice, getConsentSnapshot, getServerConsentSnapshot);
}

export const consentPreferenceMeta = {
  cookieName,
  storageKey,
  legacyStorageKey,
  version,
  eventName,
  maxAgeSeconds
};
