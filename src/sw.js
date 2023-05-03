import { precacheAndRoute, createHandlerBoundToURL, cleanupOutdatedCaches, PrecacheController } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
// import api from '@/services'
// const precacheController = new PrecacheController()
const dataCacheName = 'workbox-precache-v2-http://127.0.0.1:8887/'
const cacheName = 'cache-rail-api'

precacheAndRoute(self.__WB_MANIFEST);
// precacheAndRoute([
//   {url: 'http://localhost:3000/api/rail-survey/?offset=0'},
//   {url: 'http://localhost:3000/api/rail-survey/count'}
// ])
// workbox.precaching.suppressWarnings();
// workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
// Listen for request events
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        console.log(response);
        // Cache hit - return response
        if (response) {
          return response;
        }
        // IMPORTANT: Clone the request. A request is a stream and
        // can only be consumed once. Since we are consuming this
        // once by cache and once by the browser for fetch, we need
        // to clone the response
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200) {
              return response;
            }
            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have 2 stream.
            console.log(response);
            var responseToCache = response.clone();
            caches.open(dataCacheName)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        );
      })
    );
})
// install new service worker when ok, then reload page.
self.addEventListener("message", msg => {
  console.log(msg);
})
// SKIP WAITING
self.addEventListener('install', (event) => {
  console.log('install');
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell')
      return cache.addAll([
        'http://localhost:3000/api/rail-survey/?offset=0',
        'http://localhost:3000/api/rail-survey/count'
      ]);
    })
  )
  self.skipWaiting()
})
self.addEventListener('activate', event => {
  console.log('activate');
  event.waitUntil(clients.claim());
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'some-unique-tag') {
    console.log('sync event')
    // event.waitUntil(getDailyNewsInCache())
    // retrieve data from indexedDB
    // make the api call with the data
  }
})
registerRoute(new NavigationRoute(createHandlerBoundToURL('/index.html')))