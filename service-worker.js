const CACHE_NAME = 'handball-referee-cache-v2'; // J'ai incrémenté la version du cache
const urlsToCache = [
  './', // Sert à cacher la page racine (index.html par défaut si "start_url": "./")
  './index.html', // Ton fichier HTML principal
  //'./manifest.json', // Le manifeste lui-même
  //'/icons/icon-192x192.png', // L'icône de 192x192 pixels
  //'/icons/icon-512x512.png'  // L'icône de 512x512 pixels
  // Plus aucune référence à style.css ou script.js car ils sont intégrés
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
