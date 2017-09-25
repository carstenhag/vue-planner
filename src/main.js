// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import moment from 'moment'

Vue.config.productionTip = false

Vue.use(VueResource)

Vue.filter('formatDateToHour', function (value) {
  moment.locale('de')
  if (value) return momentush((request, next) => {
  request.url += (request.url.indexOf('?') > 0 ? '&' : '?') + `cb=${new Date().getTime()}`
  next()

import {store} from './store'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
