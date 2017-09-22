import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Meta from 'vue-meta'

Vue.use(Router)
Vue.use(Meta)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    }
  ]
})
