const CACHE_NAME = 'sai-sms-v3';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/assets/logo.png',
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Poppins:wght@300;400;500;600;700&family=Open+Sans:wght@400;600&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                // Attempt to cache static assets
                return cache.addAll(urlsToCache).catch(err => console.log('Some assets could not be cached on install', err));
            })
    );
    self.skipWaiting();
});

self.addEventListener('fetch', event => {
    // Only cache GET requests
    if (event.request.method !== 'GET') return;

    const url = event.request.url;

    // Skip Firestore API and other non-cacheable cross-origin requests
    const isLocal = url.startsWith(self.location.origin);
    const isCDN = url.includes('cdn') || url.includes('fonts');
    const isFirebaseStorage = url.includes('firebasestorage.googleapis.com');
    // PDF cache condition: Firebase storage or ending with .pdf
    const isPDF = url.endsWith('.pdf') || isFirebaseStorage;

    if (!isLocal && !isCDN && !isPDF) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version if found
                if (response) {
                    return response;
                }

                // Otherwise fetch from network
                return fetch(event.request).then(
                    function (networkResponse) {
                        // Don't cache if not a valid response
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'opaque') {
                            return networkResponse;
                        }

                        // Clone the response because it's a stream
                        var responseToCache = networkResponse.clone();

                        caches.open(CACHE_NAME)
                            .then(function (cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return networkResponse;
                    }
                );
            }).catch(() => {
                // If both cache and network fail, fall back to index.html for navigation requests
                if (event.request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
            })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});
