import { createStore } from 'vuex'

export default createStore({
  state: {
    count: 0,
    isDark: false
  },
  getters: {
    getCount: (state) => state.count
  },
  mutations: {
    increment: (state) => state.count++,
    toggleDarkMode: (state, payload) => {
      if ([true, false].includes(payload)) {
        state.isDark = payload
      } else {
        state.isDark = !state.isDark
      }
    }
  },
  actions: {
  },
  modules: {
  }
})
