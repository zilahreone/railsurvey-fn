// self.__precacheManifest = [].concat(self.__precacheManifest || []);

// workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

// import {precacheAndRoute} from 'workbox-precaching';
import { precacheAndRoute, createHandlerBoundToURL, cleanupOutdatedCaches } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import api from '@/services'

precacheAndRoute(self.__WB_MANIFEST);

const cacheName = 'my-cache-v1'

// self.addEventListener("load", () => {
//   console.log('load');
//   function handleNetworkChange(event) {
//     if (navigator.onLine) {
//       console.log('online');
//       // document.body.classList.remove("offline");
//     } else {
//       console.log('offline');
//       // document.body.classList.add("offline");
//     }
//   }
//   self.addEventListener("online", handleNetworkChange);
//   self.addEventListener("offline", handleNetworkChange);
// });

// SKIP WAITING
self.addEventListener('install', (event) => {
  console.log(event);
  self.skipWaiting()
})

self.addEventListener('activate', function (event) {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          // return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('message', (event) => {
  console.log('message')
  // console.log(event.data.type);
  // if (event.data && event.data.type === "SKIP_WAITING") {
  //   self.skipWaiting()
  // }
})

self.addEventListener('fetch', (event) => {
  if (event.request.headers.get('Accept').includes('application/json')) {
    console.log(event.request.url);
    if (event.request.method === 'GET') {
      event.respondWith(
        caches.match(event.request).then((response) => {
          if (navigator.onLine) {
            return fetch(event.request).then((response) => {
              return caches.open(cacheName).then((cache) => {
                cache.put(event.request.url, response.clone());
                return response;
              })
            })
          } else {
            if (response) {
              console.log('USE CACHE')
              return response
            }
          }
        })
      );
    }
  }
})

self.addEventListener('sync', (event) => {
  if (event.tag === 'some-unique-tag') {
    console.log('sync event')
    console.log(event)
    event.waitUntil(getDailyNewsInCache())
    // retrieve data from indexedDB
    // make the api call with the data
  }
})

function getDailyNewsInCache () {
  api.post('/', { name: 'hihi' }, null).then(() => Promise.resolve()).catch(() => Promise.reject())
}

// self.addEventListener('periodicsync', event => {
//   if (event.tag === 'get-daily-news') {
//     event.waitUntil(getDailyNewsInCache());
//   }
// })

// self.addEventListener('fetch', (event) => {
//   // console.log('Fetch');
//   const request = event.request
//   const url = request.url

//   // console.log(request.headers.get('Accept'), url)

//   if (request.headers.get('Accept').includes('application/json')) {
//     console.log('json');
//     event.respondWith(
//       // caches.match(request).then( cached_result => cached_result || fetch(request))
//       // .catch(() => {
//       //   if (event.request.mode === 'navigate') {
//       //     return caches.match('page')
//       //   }
//       // })
//       caches.match(request).then( cached_result => {
//         // console.log(cached_result)
//         if (cached_result) {
//           console.log('use cache')
//           return cached_result
//         }
//         console.log('fetch api')
//         return fetch(request).then(response => {
//           // console.log(response)
//           const copy = response.clone()
//           // Wait until the response we received is added to the cache.
//           return event.waitUntil(
//             caches.open( 'pages' ).then(cache => {
//               return cache.put( request, response )
//             })
//           )
//           // return response
//         }).catch(() => caches.match( '/offline/' ))
//       })
//     )
//   }
// })

// self.addEventListener('online',  function() {
//   console.log('You are online!')
// })
// self.addEventListener('offline', function() {
//   console.log('Oh no, you lost your network connection.')
// })

cleanupOutdatedCaches()
registerRoute(new NavigationRoute(createHandlerBoundToURL('/index.html')))

// Additional code goes here.
// let click_open_url;
//Web Push Notifications//
// self.addEventListener("push", function(event) {
//   let push_message = event.data.text();

//   click_open_url = "https://vuemeetup.com";
//   const options = {
//     body: push_message.body,
//     icon: "./img/logo.82b9c7a5.png",
//     image: "./itWorks.gif"
//   };
//   event.waitUntil(
//     self.registration.showNotification("my notification", options)
//   );
// });

// workbox.routing.registerRoute(
//   new RegExp("https://fonts.(?:googleapis|gstatic).com/(.*)"),
//   workbox.strategies.cacheFirst({
//     cacheName: "googleapis",
//     plugins: [
//       new workbox.expiration.Plugin({
//         maxEntries: 30
//       })
//     ]
//   })
// );

// self.addEventListener("notificationclick", function(event) {
//   const clickedNotification = event.notification;
//   clickedNotification.close();
//   if (click_open_url) {
//     const promiseChain = clients.openWindow(click_open_url);
//     event.waitUntil(promiseChain);
//   }
// });
