const CACHE_NAME = 'handball-referee-cache-v6'; // Incrémente la version du cache pour s'assurer que les changements sont pris en compte
const urlsToCache = [
  '/carton-arbitre-hand/', // La racine de ton application GitHub Pages
  '/carton-arbitre-hand/index.html',
  '/carton-arbitre-hand/manifest.json',
  '/carton-arbitre-hand/icons/icon-512x512.png'
];

// Événement 'install' : le Service Worker s'installe et met en cache les ressources essentielles
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installation...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Mise en cache des ressources :');
        return cache.addAll(urlsToCache)
          .catch(error => {
            console.error('[Service Worker] Erreur lors de la mise en cache (vérifie les chemins) :', error);
            // Si une ressource ne peut pas être mise en cache, l'installation échoue.
            // Il est important que tous les chemins dans urlsToCache soient valides.
          });
      })
      .then(() => {
        return self.skipWaiting(); // Force l'activation du Service Worker immédiatement
      })
  );
});

// Événement 'activate' : le Service Worker prend le contrôle de la page et nettoie les anciens caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activation...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Suppression de l\'ancien cache :', cacheName);
            return caches.delete(cacheName); // Supprime les caches qui ne correspondent plus à la version actuelle
          }
        })
      );
    }).then(() => {
      return self.clients.claim(); // Permet au Service Worker de contrôler les clients immédiatement
    })
  );
});

// Événement 'fetch' : intercepte les requêtes réseau pour servir des ressources depuis le cache ou le réseau
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Si la ressource est dans le cache, on la retourne
        if (response) {
          return response;
        }
        // Sinon, on va chercher la ressource sur le réseau
        return fetch(event.request)
          .catch(error => {
            console.error('[Service Worker] Erreur de récupération réseau :', error);
            // Tu peux ajouter une page hors ligne ici si tu veux
            // Par exemple: return caches.match('/offline.html');
          });
      })
  );
});
