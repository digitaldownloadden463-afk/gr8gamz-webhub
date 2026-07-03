
'use client';

export function postToGr8(endpoint, payload = {}) {
  if (typeof window === 'undefined') return;
  try {
    const body = JSON.stringify(payload);
    const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    if (navigator.sendBeacon && body.length < 60000) {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon(url, blob);
      return;
    }
    fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
      keepalive: true
    }).catch(() => {});
  } catch {
    // Silent by design: local gameplay must never break because the persistence bridge is unavailable.
  }
}

export async function fetchGr8Status() {
  try {
    const response = await fetch('/api/gr8/database/status', { cache: 'no-store' });
    return await response.json();
  } catch (error) {
    return { ok: false, configured: false, connected: false, error: error?.message || 'Status check failed' };
  }
}
