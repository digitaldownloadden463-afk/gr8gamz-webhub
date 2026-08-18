'use client';

import { useSyncExternalStore } from 'react';

export type PartnerContentChoice = 'accepted' | 'rejected';
export type PartnerContentSnapshot = PartnerContentChoice | null | 'unknown';

const storageKey = 'gr8:partner-content-consent:v1';
const signalKey = 'gr8:partner-content-consent:signal';
const cookieName = 'gr8_partner_content';
const eventName = 'gr8-partner-content-consent-change';
const version = 'v1';
const maxAgeSeconds = 60 * 60 * 24 * 180;

let memoryChoice: PartnerContentChoice | null = null;
let channel: BroadcastChannel | null = null;
const listeners = new Set<() => void>();

function isChoice(value: unknown): value is PartnerContentChoice {
  return value === 'accepted' || value === 'rejected';
}

function parseChoice(value: string | null | undefined): PartnerContentChoice | null {
  if (!value) return null;
  const [storedVersion, choice] = value.split('.');
  return storedVersion === version && isChoice(choice) ? choice : null;
}

function readCookie() {
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

function readStorage(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function readExternalChoice(): PartnerContentChoice | null {
  return parseChoice(readStorage(storageKey)) || parseChoice(readCookie());
}

function notify() {
  for (const listener of listeners) listener();
}

function persistChoice(choice: PartnerContentChoice) {
  const encoded = `${version}.${choice}`;
  memoryChoice = choice;
  try {
    window.localStorage.setItem(storageKey, encoded);
    window.localStorage.setItem(signalKey, `${encoded}.${Date.now()}`);
  } catch {}
  try {
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${cookieName}=${encoded}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`;
  } catch {}
}

export function getPartnerContentChoice(): PartnerContentChoice | null {
  if (typeof window === 'undefined') return null;
  if (memoryChoice) return memoryChoice;
  memoryChoice = readExternalChoice();
  return memoryChoice;
}

export function setPartnerContentChoice(choice: PartnerContentChoice) {
  persistChoice(choice);
  notify();
  try {
    window.dispatchEvent(new CustomEvent(eventName, { detail: choice }));
  } catch {}
  try {
    channel?.postMessage(choice);
  } catch {}
}

export function subscribePartnerContentChoice(listener: () => void) {
  listeners.add(listener);

  const eventListener = () => listener();
  const storageListener = (event: StorageEvent) => {
    if (event.key !== storageKey && event.key !== signalKey) return;
    memoryChoice = readExternalChoice();
    notify();
  };

  if (!channel && typeof BroadcastChannel !== 'undefined') {
    try {
      channel = new BroadcastChannel(eventName);
      channel.addEventListener('message', (event) => {
        if (!isChoice(event.data)) return;
        memoryChoice = event.data;
        notify();
      });
    } catch {
      channel = null;
    }
  }

  try {
    window.addEventListener(eventName, eventListener);
    window.addEventListener('storage', storageListener);
  } catch {}

  return () => {
    listeners.delete(listener);
    try {
      window.removeEventListener(eventName, eventListener);
      window.removeEventListener('storage', storageListener);
    } catch {}
  };
}

export function getPartnerContentSnapshot(): PartnerContentSnapshot {
  return getPartnerContentChoice();
}

export function getServerPartnerContentSnapshot(): PartnerContentSnapshot {
  return 'unknown';
}

export function usePartnerContentChoice() {
  return useSyncExternalStore(
    subscribePartnerContentChoice,
    getPartnerContentSnapshot,
    getServerPartnerContentSnapshot
  );
}

export const partnerContentConsentMeta = {
  storageKey,
  signalKey,
  cookieName,
  eventName,
  version,
  maxAgeSeconds
};
