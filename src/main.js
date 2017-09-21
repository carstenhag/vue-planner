// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
var moment = require('moment')

Vue.config.productionTip = false

Vue.use(VueResource)

Vue.filter('formatDate', function (value) {
  if (value) {
    return moment(String(value)).format('hh:mm')
  }
})

import {store} from './store'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
