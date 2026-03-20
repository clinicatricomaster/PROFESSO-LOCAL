const CACHE = 'professo-v4';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fresh = fetch(e.request).then(r => {
        if (r.ok) {
          const c = r.clone();
          caches.open(CACHE).then(ca => ca.put(e.request, c));
        }
        return r;
      }).catch(() => cached);
      return cached || fresh;
    })
  );
});
