import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import './assets/tailwind.css'
import { VueSignaturePad } from 'vue-signature-pad'

const app = createApp(App)
app.use(store)
app.use(router)
app.component('VueSignaturePad', VueSignaturePad)
app.mount('#app')