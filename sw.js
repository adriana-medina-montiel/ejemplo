// 1. Nombre del caché y archivos a cachear 
const CACHE_NAME = "Mi-cache-v1";
const urlsToCache = [
  "index.html",
  "offline.html",
  "manifest.json",
  "icons/icon-192x192.png",
  "icons/icon-512x512.png"
];

// 2. INSTALL -> se ejecuta al instalar el Service Worker
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(err => console.error("Error al cachear archivos:", err))
  );
});

// 3. ACTIVATE -> limpia cachés antiguas
self.addEventListener("activate", event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => !cacheWhitelist.includes(key))
            .map(key => caches.delete(key))
      )
    )
  );
});

// 4. FETCH -> Responde con caché o red
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => caches.match("offline.html"));
    })
  );
});

// 5. PUSH -> Notificaciones (opcional)
self.addEventListener("push", event =>{
  const data = event.data ? event.data.text() : "Notificación sin texto";
  event.waitUntil(
    self.registration.showNotification("Mi PWA", { body: data })
  );
});