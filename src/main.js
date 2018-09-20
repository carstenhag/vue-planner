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
  if (value) return moment(String(value)).format('HH:mm')
})

Vue.filter('formatDateToMonthDay', function (value) {
  moment.locale('de')
  if (value) return moment(String(value)).format('dd. DD.MM.YYYY')
})

Vue.filter('formatDateISO8601Short', function (value) {
  if (value) return moment(String(value)).format('YYYY-MM-DD')
})

// Adds a cachebuster to resources, so the ics files don't get cached
Vue.http.interceptors.push((request, next) => {
  request.url += (request.url.indexOf('?') > 0 ? '&' : '?') + `cb=${new Date().getTime()}`
  next()
})

import {store} from './store'

// https://github.com/Justineo/vue-awesome
// import all icons if you don't care about bundle size
import 'vue-awesome/icons'

import Icon from 'vue-awesome/components/Icon'
Vue.component('icon', Icon)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
