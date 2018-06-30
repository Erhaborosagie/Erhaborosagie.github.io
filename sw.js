let staticCacheName = 'v7';
let allCaches = [
    '/', 
    `https://free.currencyconverterapi.com/api/v5/countries `,
    '/index.html',
    '/js/apps.js',
    '/css/main.css',
    './image/ico.png'
]

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(staticCacheName).then((cache) => {
            return cache.addAll(allCaches);
        })
    )
})
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) =>{
                    if(cacheName !==staticCacheName){
                        console.log('deleting cacheName')
                        return caches.delete(cacheName);
                    }
                })
            )
        })
    )
})
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            if(response) return response;
            return fetch(e.request);
        })
        
    )
})