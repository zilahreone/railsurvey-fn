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
    tokenParsed: null,
    profile: {},
    logout: null
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
    setToken: (state, payload) => state.token = payload,
    setTokenParsed: (state, payload) => state.tokenParsed = payload,
    setProfile: (state, payload) => state.profile = payload,
    clearState (state) {
      state = {
        token: null,
        tokenParsed: null,
        profile: {}
      }
    },
    logout: (state, payload) => state.logout = payload
  },
  actions: {
    logout (context) {
      context.commit('clearState')
    }
  },
  modules: {
  }
})
