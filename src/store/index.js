import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      firstName: '',
      lastName: '',
      roles: [],
      username: '',
      id: ''
    }
  },
  mutations: {
    LOGIN (state, value) {
      state.user = value
    }
  },
  strict: process.env.NODE_ENV === 'development'
})

export const LOGIN_ACTION = 'LOGIN'
