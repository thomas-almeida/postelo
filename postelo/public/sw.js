// Service Worker para PWA
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('postelo-v1').then(cache => {
      return cache.addAll([
        '/',
        '/camera',
        '/preview',
        '/gallery',
        '/manifest.json',
        '/icon-192.png',
        '/icon-512.png',
        '/_next/static/css/app/layout.css',
        '/_next/static/chunks/app/page.js',
        '/_next/static/chunks/app/camera/page.js',
        '/_next/static/chunks/app/preview/page.js',
        '/_next/static/chunks/app/gallery/page.js'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});