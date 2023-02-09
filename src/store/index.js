import { createStore } from 'vuex'
import kcJSON from '@/keycloak.json'
import Keycloak from 'keycloak-js'

const keycloak = new Keycloak(kcJSON)

export default createStore({
  state: {
    count: 0,
    isDark: false,
    isSuportIndexedDB: true,
    token: null,
    profile: {},
    keycloak: null
  },
  getters: {
    getCount: (state) => state.count
    // getSupportIndexedDB: (state) => state.isSuportIndexedDB
  },
  mutations: {
    increment: (state) => state.count++,
    toggleDarkMode: (state, payload) => {
      if ([true, false].includes(payload)) {
        state.isDark = payload
      } else {
        state.isDark = !state.isDark
      }
    },
    setSupportIndexedDB: (state, payload) => state.isSuportIndexedDB = payload,
    setKeycloak: (state, payload) => state.keycloak = payload,
    setToken: (state, payload) => state.token = payload,
    setProfile: (state, payload) => state.profile = payload,
    logout: (state) => state.keycloak.logout(),
    clearState (state) {
      state = {
        token: null,
        tokenParsed: null,
        profile: {}
      }
    }
  },
  actions: {
    logout (context) {
      context.commit('logout')
    }
  },
  modules: {
  }
})
