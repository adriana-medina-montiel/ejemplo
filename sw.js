// 1. Nombre del caché y archivos a cachear
const CACHE_NAME = "mi-cache-v1";
const urlsToCache = [
  "index.html",
  "offline.html",
  "icons/icon-192x192.png",
  "icons/icon-512x512.png"
];

// 2. INSTALL -> Se ejecuta al instalar el SW
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// 3. ACTIVATE -> Se ejecuta al activarse (limpia cachés viejas)
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );
});

// 4. FETCH -> Intercepta las peticiones (modo offline)
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return (
        response ||
        fetch(event.request).catch(() => caches.match("offline.html"))
      );
    })
  );
});

// 5. PUSH -> Se ejecuta al recibir una notificación push
self.addEventListener("push", event => {
  const data = event.data ? event.data.text() : "Notificación sin texto";
  event.waitUntil(
    self.registration.showNotification("Mi PWA", {
      body: data,
      icon: "icons/icon-192x192.png"
    })
  );
});
