const CACHE_NAME = 'gr8-gamz-shell-v3-consent-gameplay-repair';
const GR8_CACHE_PREFIX = 'gr8-gamz-shell-';
const SHELL_ASSETS = [
  '/offline.html',
  '/manifest.webmanifest',
  '/icon.png',
  '/art/homepage-hero-arena.webp',
  '/og/gr8gamz-og.png'
];

async function cacheShellAssets() {
  const cache = await caches.open(CACHE_NAME);
  await Promise.allSettled(
    SHELL_ASSETS.map(async (asset) => {
      const response = await fetch(asset, { cache: 'reload' });
      if (response.ok) await cache.put(asset, response);
    })
  );
}

self.addEventListener('install', (event) => {
  event.waitUntil(cacheShellAssets().finally(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith(GR8_CACHE_PREFIX) && key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.includes('/play') ||
    url.pathname.startsWith('/_next/data') ||
    url.pathname.startsWith('/_next/image') ||
    request.headers.get('accept')?.includes('text/x-component')
  ) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/offline.html'))
    );
    return;
  }

  if (/^\/_next\/static\//.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        });
      })
    );
    return;
  }

  if (/^\/(?:icon|manifest|art\/|og\/)/.test(url.pathname)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
  }
});
