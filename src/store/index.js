import { createStore } from 'vuex'

export default createStore({
  state: {
    count: 0,
    isDark: false,
    isSuportIndexedDB: true
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
    setSupportIndexedDB: (state, payload) => state.isSuportIndexedDB = payload
  },
  actions: {
  },
  modules: {
  }
})
