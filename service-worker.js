const CACHE_NAME = 'attendance-v1';
const URLS = [
  '/Student-QR-Attendance/',
  '/Student-QR-Attendance/index.html',
  'https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(URLS).catch(function(){});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.filter(function(n) { return n !== CACHE_NAME; })
             .map(function(n) { return caches.delete(n); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      return cached || fetch(event.request).then(function(response) {
        var respClone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          try { cache.put(event.request, respClone); } catch(e) {}
        });
        return response;
      }).catch(function() { return cached; });
    })
  );
});
