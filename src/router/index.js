import Vue from 'vue'
import Router from 'vue-router'
import Vorlesungen from '@/components/Vorlesungen'
import Meta from 'vue-meta'

Vue.use(Router)
Vue.use(Meta)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Vorlesungen',
      component: Vorlesungen
    }
  ]
})
