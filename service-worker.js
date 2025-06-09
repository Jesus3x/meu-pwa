const CACHE_NAME = 'financaspro3-cache-v1';
const FILES_TO_CACHE = [
  '/meu-pwa/',
  '/meu-pwa/index.html',
  '/meu-pwa/manifest.json',
  '/meu-pwa/icons/icon-192.png',
  '/meu-pwa/icons/icon-512.png',
  // Adicione outros arquivos importantes como CSS, JS ou fontes
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  if (evt.request.mode === 'navigate') {
    evt.respondWith(
      fetch(evt.request).catch(() => {
        return caches.match('/meu-pwa/index.html');
      })
    );
  } else {
    evt.respondWith(
      caches.match(evt.request).then((response) => {
        return response || fetch(evt.request);
      })
    );
  }
});
