import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import './assets/tailwind.css'
import { VueSignaturePad } from 'vue-signature-pad'
import api from '@/services'
import IndexedDB from '@/IndexedDB'
import kcJSON from '@/keycloak.json'
import Keycloak from 'keycloak-js'
const app = createApp(App)

// REGISTER SERVICEWORKER
// if ("serviceWorker" in navigator) {
//   // Register a service worker hosted at the root of the
//   // site using the default scope.
//   navigator.serviceWorker.register('./service-worker.js').then(
//     (registration) => {
//       // console.log("Service worker registration succeeded:", registration);
//       if (registration.installing) {
//         console.log("Service worker installing");
//       } else if (registration.waiting) {
//         console.log("Service worker installed");
//       } else if (registration.active) {
//         console.log("Service worker active");
//       }
//     },
//     (error) => {
//       console.error(`Service worker registration failed: ${error}`);
//     }
//   );
// } else {
//   console.error("Service workers are not supported.");
// }
IndexedDB.insertData('name', 1, {})
// CHECK SUPPORT INDEXED_DB
// if (!self.indexedDB) {
//   console.warn(`Your browser doesn't support IndexedDB`)
//   store.commit('setSupportIndexedDB', false)
// }
// navigator.serviceWorker.getRegistrations().then(function(registrations) { for(let registration of registrations) { registration.unregister() } })
// api.get('/', null).then((resp) => {
//   if (resp.status === 200) {
//     resp.json().then((json) => {
//       // IndexedDB.insertData('name', 1, json)
//     })
//   }
// })

// KEYCLOAK HANDLE
// const keycloak = new Keycloak(kcJSON)
// keycloak.init({ onLoad: 'login-required', checkLoginIframe: false }).then((auth) => {
//   if (!auth) {
//     window.location.reload()
//   }
//   // setInterval(() => {
//   // }, 1000 * 10)
// }).catch(() => {
//   console.error('Authenticated Failed')
// })

// keycloak.onAuthSuccess = function () {
//   // console.log(keycloak.token )
//   const app = createApp(App)
//   // app.provide('myGlobalVariable', console.log('hello'))
//   // app.config.globalProperties.$globalVar = 'globalVar'
//   app.use(store)
//   app.use(router)
//   app.component('VueSignaturePad', VueSignaturePad)
//   app.mount('#app')

//   store.commit('setKeycloak', keycloak)
//   store.commit('setToken', keycloak.token)
//   store.commit('setProfile', {
//     id: keycloak.tokenParsed.sub,
//     fname: keycloak.tokenParsed.given_name,
//     lname: keycloak.tokenParsed.family_name,
//     email: keycloak.tokenParsed.email,
//     username: keycloak.tokenParsed.preferred_username
//   })
//   // IndexedDB.getContactById('1234')
//   // IndexedDB.insertData('railway-survey', 1, { id: '12345', fname: 'wissarut', lname: 'sangjong' })
//   // api.get(`/users/${keycloak.tokenParsed.sub}`, null).then((resp) => {
//   //   if (resp.status === 200) {
//   //     resp.blob().then((data) => {
//   //       if (data['size'] === 0) {
//   //         api.post('/users', store.state.profile, keycloak.token).then((resp) => {
//   //           if (resp.status === 201) {
//   //             console.log(resp)
//   //           }
//   //         })
//   //       }
//   //     })
//   //   }
//   // })
// }
// keycloak.onTokenExpired = function () {
//   keycloak.updateToken(70).then((refreshed) => {
//     // console.log(keycloak.tokenParsed )
//     if (refreshed) {
//       console.log('Token refreshed ' + refreshed)
//       store.commit('setToken', keycloak.token)
//     } else {
//       console.warn('Token not refreshed, valid for ' + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds')
//       window.location.reload()
//     }
//   }).catch(() => {
//     console.error('Failed to refresh token')
//   });
// }
//////////////////
// localStorage.clear()
// console.log(local.key(0))
app.use(router)
app.use(store)
app.component('VueSignaturePad', VueSignaturePad)
app.mount('#app')
