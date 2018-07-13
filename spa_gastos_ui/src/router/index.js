import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login'
import Gastos from '../components/Gastos'
import store from '../store'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'Root',
      beforeEnter (to, from, next) {
        next('/gastos')
      }
    },
    {
      path: '/gastos',
      name: 'Gastos',
      component: Gastos,
      beforeEnter (to, from, next) {
        if (!store.getters.isAuthenticated) {
          next('/login')
        } else {
          next()
        }
      }
    }
  ]
})
