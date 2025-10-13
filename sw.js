//estructura basica de un service worker 

//1.- Nombre del caché y archivos  a cachear 

const CACHE_NAME = "mi-cache-v1";
const urlsTocache = [
    "index.html",
    "style-css",
    "app.js",
    "offline.html"
];

//2. INSTALL -> Se ejecuta al instalar el sw
self.addEventListener("install",event =>{
    event.waitUtill(
        caches.open(CACHE_NAME).then(Cache=> caches.addALL(urlsTocache))
    );
});

//3.ACTIVATE -> Se ejeciuta al activarse (limpia caches viejas)
self.addEventListener("activate",event =>{
    event.waitUtill(
        caches.keys().then(keys =>{
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                .map(key => caches.delete(key))
            );
        }
    ));
});