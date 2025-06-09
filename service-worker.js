const CACHE_NAME = 'financaspro3-cache-v1'; // Nome do cache
const FILES_TO_CACHE = [
  '/meu-pwa/', // Página principal
  '/meu-pwa/index.html', // HTML
  '/meu-pwa/manifest.json', // Manifesto
  '/meu-pwa/icons/icon-192.png', // Ícone
  '/meu-pwa/icons/icon-512.png', // Ícone maior
  // Adicione outros arquivos importantes como CSS, JS ou fontes
];

// Instalação do Service Worker - Adiciona os arquivos ao cache
self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting(); // Força o SW a ser ativado imediatamente
});

// Ativação do Service Worker - Limpeza de caches antigos
self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key); // Apaga caches antigos
          }
        })
      )
    )
  );
  self.clients.claim(); // Torna o SW ativo imediatamente para todos os clientes
});

// Interceptação das requisições de rede - Cache ou fallback para offline
self.addEventListener('fetch', (evt) => {
  if (evt.request.mode === 'navigate') {
    // Para requisições de navegação (ex.: acesso ao site)
    evt.respondWith(
      fetch(evt.request).catch(() => {
        return caches.match('/meu-pwa/index.html'); // Fallback para a página inicial se estiver offline
      })
    );
  } else {
    // Para outros tipos de requisição, tenta servir do cache ou da rede
    evt.respondWith(
      caches.match(evt.request).then((response) => {
        return response || fetch(evt.request);  // Retorna do cache ou faz a requisição
      })
    );
  }
});
