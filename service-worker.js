/**
 * Shruhi Collections — Production PWA Service Worker (v2.1)
 * =========================================================
 * Provides offline navigation resilience, instant repeat visits,
 * and intelligent caching for 4K studio product plates.
 */

const CACHE_NAME = 'shruhi-cache-v2.1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/catalog-data.js',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/collections/curvy-couture.html',
  '/collections/mens-luxury-shirts.html',
  '/collections/festive-couture.html'
];

// Install: pre-cache critical shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching offline storefront shell');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: purge older cache generations
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Purging stale cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: strategic caching per asset classification
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Ignore non-GET or cross-origin requests
  if (req.method !== 'GET' || url.origin !== location.origin) {
    return;
  }

  // 1. Static Image Plates: Cache-first with network fallback
  if (req.destination === 'image' || url.pathname.includes('/assets/')) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          if (res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return res;
        });
      })
    );
    return;
  }

  // 2. HTML & Navigation: Network-first with cache fallback (guarantees fresh catalog)
  if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(req).then((res) => {
        if (res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        }
        return res;
      }).catch(() => {
        return caches.match(req).then((cached) => cached || caches.match('/index.html'));
      })
    );
    return;
  }

  // 3. CSS/JS: Stale-while-revalidate
  event.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req).then((res) => {
        if (res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        }
        return res;
      }).catch(() => null);

      return cached || fetchPromise;
    })
  );
});
