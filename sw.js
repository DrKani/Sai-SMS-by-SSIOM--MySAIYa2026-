
const CACHE_NAME = 'sai-sms-v1';
const ASSETS = [
  '/',
  '/index.html',
  'https://www.sathyasai.org/sites/default/files/pages/organisation/logo/ssio-logo-english.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
