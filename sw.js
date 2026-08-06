const CACHE = 'runavital-v2';
const ASSETS = [
  './Runavital.dc.html',
  './support.js',
  './manifest.json',
  './assets/runavital-logo.jpeg',
  './assets/icon-192.png',
  './assets/icon-512.png'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).then((res) => {
      const resClone = res.clone();
      caches.open(CACHE).then((cache) => cache.put(e.request, resClone));
      return res;
    }).catch(() => caches.match(e.request))
  );
});
