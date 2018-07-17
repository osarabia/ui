
import Vue from 'vue'
import Vuex from 'vuex'

import {authenticate, uploadFile, createResource, listResources, deleteResource} from '../api'
import {isValidJwt, EventBus} from '../utils'

Vue.use(Vuex)

const state = {
  user: {},
  jwt: ''
}

const actions = {
  login (context, userData) {
    context.commit('setUserData', { userData })
    return authenticate(userData)
      .then(response => context.commit('setJwtToken', { jwt: response.data }))
      .catch(error => {
        EventBus.$emit('failedAuthentication', error)
        return Promise.reject(error)
      })
  },
  upload (context, fileData) {
    return uploadFile(fileData, state.jwt.token)
      .catch(error => {
        return Promise.reject(error)
      })
  },
  create (context, data) {
    return createResource(data, state.jwt.token)
      .catch(error => {
        console.log(error)
        return Promise.reject(error)
      })
  },
  list (context, queryparams) {
    return listResources(state.jwt.token, queryparams)
      .catch(error => {
        console.log(error)
        return Promise.reject(error)
      })
  },
  delete (context, id) {
    return deleteResource(id, state.jwt.token)
      .catch(error => {
        console.log(error)
        return Promise.reject(error)
      })
  }
}

const mutations = {
  setUserData (state, payload) {
    state.userData = payload.userData
  },
  setJwtToken (state, payload) {
    localStorage.token = payload.jwt.token
    state.jwt = payload.jwt
  }
}

const getters = {
  isAuthenticated: state => () => {
    return isValidJwt(state.jwt.token)
  }
}

const store = new Vuex.Store({
  state,
  actions,
  mutations,
  getters
})

export default store
