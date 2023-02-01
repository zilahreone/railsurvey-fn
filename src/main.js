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
  if (!auth) {
    window.location.reload()
  }
  // setInterval(() => {
  // }, 1000 * 10)
}).catch(() => {
  console.error('Authenticated Failed')
})

keycloak.onAuthSuccess = function () {
  console.log(keycloak.tokenParsed )
  const app = createApp(App)
  // app.provide('myGlobalVariable', console.log('hello'))
  // app.config.globalProperties.$globalVar = 'globalVar'
  app.use(store)
  app.use(router)
  app.component('VueSignaturePad', VueSignaturePad)
  app.mount('#app')

  store.commit('setProfile', {
    fname: keycloak.tokenParsed.given_name,
    lname: keycloak.tokenParsed.family_name,
    email: keycloak.tokenParsed.email,
    username: keycloak.tokenParsed.preferred_username
    // id: keycloak.tokenParsed.id
  })

  api.post('/api/rail-survey', { email: 'asd@sdf.com', age: 10 }, keycloak.token).then((resp) => {
    if (resp.status === 201) {
      console.log(resp).then((re) => {
        console.log(re);
      });
    }
  })
}


keycloak.onTokenExpired = function () {
  keycloak.updateToken(70).then((refreshed) => {
    console.log(keycloak.tokenParsed )
    if (refreshed) {
      console.log('Token refreshed ' + refreshed)
      store.commit('setToken', keycloak.token)
      store.commit('setTokenParsed', keycloak.tokenParsed)
    } else {
      // store.commit('setToken', keycloak.token)
      // store.commit('setTokenParsed', keycloak.tokenParsed)
      // console.log(keycloak)
      // console.log(keycloak.idToken )
      // console.log(keycloak.idTokenParsed)
      // console.log(keycloak.token)
      // console.log(keycloak.tokenParsed )
      console.warn('Token not refreshed, valid for ' + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds')
    }
  }).catch(() => {
    console.error('Failed to refresh token')
  });
}

// app.use(store)
// app.use(router)
// app.component('VueSignaturePad', VueSignaturePad)
// app.mount('#app')
