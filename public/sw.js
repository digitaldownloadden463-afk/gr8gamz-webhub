const CACHE_NAME = 'gr8-gamz-shell-v2-artwork-repair';
const SHELL_ASSETS = [
  '/',
  '/games',
  '/gr8-originals',
  '/my-arcade',
  '/offline.html',
  '/manifest.webmanifest',
  '/icon.png',
  '/art/homepage-hero-arena.webp',
  '/og/gr8gamz-og.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/') || url.pathname.includes('/play') || url.pathname.startsWith('/_next/image')) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/offline.html')))
    );
    return;
  }

  if (/\/(?:_next\/static|icon|manifest|art\/|og\/|games\/.*thumb)/.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const network = fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        });
        return cached || network;
      })
    );
    return;
  }

  event.respondWith(
    fetch(request).then((response) => {
      if (response.ok && /\/(?:partner-games\/.*cover)/.test(url.pathname)) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
      }
      return response;
    }).catch(() => caches.match(request))
  );
});
