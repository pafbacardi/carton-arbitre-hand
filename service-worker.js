const CACHE_NAME = 'handball-referee-cache-v5'; // Incrémente la version du cache
const urlsToCache = [
  '/carton-arbitre-hand/', // La racine de ton application GitHub Pages
  '/carton-arbitre-hand/index.html',
  '/carton-arbitre-hand/manifest.json',
  '/carton-arbitre-hand/icons/icon-512x512.png'
];

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installation...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Mise en cache des ressources :');
        return cache.addAll(urlsToCache)
          .catch(error => {
            console.error('[Service Worker] Erreur lors de la mise en cache (vérifie les chemins) :', error);
          });
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activation...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Suppression de l\'ancien cache :', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .catch(error => {
            console.error('[Service Worker] Erreur de récupération réseau :', error);
          });
      })
  );
});
