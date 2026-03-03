const CACHE_NAME = 'kurdflux-v1';
const urlsToCache = [
  '/',
  'https://cdn.plyr.io/3.7.8/plyr.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/hls.js@latest',
  'https://cdn.plyr.io/3.7.8/plyr.polyfilled.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(networkResponse => {
            // ئەگەر داوای فایلێکی ستاتیک بوو، لە کاشدا دەیخەین
            if (event.request.url.includes('.css') || 
                event.request.url.includes('.js') || 
                event.request.url.includes('.png') ||
                event.request.url.includes('.jpg')) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // ئەگەر هێڵی ئینتەرنێت نەبوو، پەڕەی ئۆفلاین پیشان بدە (ئەگەر هەبێت)
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
          });
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
});