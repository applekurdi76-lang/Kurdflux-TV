const CACHE_NAME = 'kurdflux-v1';
const urlsToCache = [
  './',
  'https://cdn.plyr.io/3.7.8/plyr.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/hls.js@latest',
  'https://cdn.plyr.io/3.7.8/plyr.polyfilled.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});