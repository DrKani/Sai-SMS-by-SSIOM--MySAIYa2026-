
const CACHE_NAME = 'sai-sms-v3'; // Bump version to force update
const ASSETS = [
  '/',
  '/index.html',
  'https://www.sathyasai.org/sites/default/files/pages/organisation/logo/ssio-logo-english.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Force the waiting service worker to become the active service worker
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Use catch here so one failed asset doesn't break the whole install
      return cache.addAll(ASSETS).catch(err => console.error("SW cache.addAll error", err));
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old caches (like sai-sms-v1)
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Take control of all open pages immediately
  );
});

self.addEventListener('fetch', (event) => {
  // Use Network First strategy for HTML pages/navigation
  if (event.request.mode === 'navigate' || event.request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // Clone the response and save it to the cache
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return networkResponse;
        })
        .catch(() => {
          // On network failure, fallback to cache
          return caches.match(event.request);
        })
    );
  } else {
    // For other assets: Cache First, then Network
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((networkResponse) => {
          // Optional: cache dynamic assets on the fly
          // const responseClone = networkResponse.clone();
          // caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          return networkResponse;
        });
      })
    );
  }
});
