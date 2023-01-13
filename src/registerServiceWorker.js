/* eslint-disable no-console */

import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready () {
      console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
      )
      // console.log(navigator.serviceWorker.ready)
      // navigator.serviceWorker.ready.then(registration => {
      // Notification.requestPermission();
      //   $('#submit-markdown').on('click', () => {
      //     saveMarkdownLocally().then(() => {
      //       registration.sync.register('persistToDatabase');
      //     }).catch(err => console.log('Error submitting markdown: ', err));
      //   })
      // })
      // .catch(err => {
      //   console.log(`ServiceWorker registration failed: ${err}`);
      // })
      navigator.serviceWorker.ready.then(async registration => {
        if (registration.periodicSync) {
          console.log('Periodic Background Sync is supported.')
          const status = await navigator.permissions.query({name: 'periodic-background-sync'});
          if (status.state === 'granted') {
            console.log('Periodic background sync can be used.')
          } else {
            console.log('Periodic background sync cannot be used.')
          }
        } else {
          console.log('Periodic Background Sync isn\'t supported.')
        }
      })
    },
    registered () {
      console.log('Service worker has been registered.')
    },
    cached () {
      console.log('Content has been cached for offline use.')
    },
    updatefound () {
      console.log('New content is downloading.')
    },
    updated () {
      console.log('New content is available; please refresh.')
    },
    offline () {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error (error) {
      console.error('Error during service worker registration:', error)
    }
  })
}
