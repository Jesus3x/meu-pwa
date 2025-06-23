const CACHE_NAME = 'financaspro3-cache-v1';
const FILES_TO_CACHE = [
  '/meu-pwa/',
  '/meu-pwa/index.html',
  '/meu-pwa/manifest.json',
  '/meu-pwa/icons/icon-192.png',
  '/meu-pwa/icons/icon-512.png',
  // Adicione aqui seus CSS, JS e outros arquivos estáticos essenciais
];

// Instalação: cache dos arquivos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Cacheando arquivos...');
        return cache.addAll(FILES_TO_CACHE);
      })
  );
  self.skipWaiting();
});

// Ativação: remove caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removendo cache antigo:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch: responde com cache ou rede, fallback para index.html offline
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/meu-pwa/index.html'))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(response => response || fetch(event.request))
    );
  }
});
