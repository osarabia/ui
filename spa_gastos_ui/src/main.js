
import Vue from 'vue'
import * as uiv from 'uiv'

import App from './App'
import router from './router'
import store from './store'

Vue.config.productionTip = false
Vue.use(uiv)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
