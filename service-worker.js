const CACHE_NAME = 'handball-referee-cache-v1';
const urlsToCache = [
  './index.html', // Ton fichier HTML principal
  './style.css', // Si tu as un fichier CSS externe
  './script.js', // Si tu as un fichier JS externe
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
  // Ajoute ici toutes les autres ressources que ton application utilise
  // (par exemple, d'autres images, polices, etc.)
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache ouvert');
        return cache.addAll(urlsToCache);
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
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
