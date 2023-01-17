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
// CHECK SUPPORT INDEXED_DB
if (!self.indexedDB) {
  console.warn(`Your browser doesn't support IndexedDB`)
  store.commit('setSupportIndexedDB', false)
}
// api.get('/', null).then((resp) => {
//   if (resp.status === 200) {
//     resp.json().then((json) => {
//       // IndexedDB.insertData('name', 1, json)
//     })
//   }
// })

const keycloak = new Keycloak(kcJSON)

keycloak.init({ onLoad: 'login-required', checkLoginIframe: false }).then((auth) => {
  console.log(!auth);
  if (!auth) {
    window.location.reload()
  } else {
    app.use(store)
    app.use(router)
    app.component('VueSignaturePad', VueSignaturePad)
    app.mount('#app')
  }

  //Token Refresh
  setInterval(() => {
    keycloak.updateToken(70).then((refreshed) => {
      if (refreshed) {
        console.log('Token refreshed' + refreshed);
      } else {
        console.warn('Token not refreshed, valid for '
          + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
      }
    }).catch(() => {
      console.error('Failed to refresh token');
    });
  }, 6000)
}).catch(() => {
  console.error('Authenticated Failed')
});
