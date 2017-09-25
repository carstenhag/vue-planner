import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Aktuell from '@/components/Aktuell'
import Vorlesungen from '@/components/Vorlesungen'
import Veranstaltungen from '@/components/Veranstaltungen'
import News from '@/components/News'
import Studierendenwerk from '@/components/Studierendenwerk'
import Meta from 'vue-meta'

Vue.use(Router)
Vue.use(Meta)

export default new Router({
  routes: [
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/aktuell',
      name: 'Aktuell',
      component: Aktuell
    },
    {
      path: '/vorlesungen', // extend with course selecting
      name: 'Vorlesungen',
      component: Vorlesungen
    },
    {
      path: '/veranstaltungen',
      name: 'Veranstaltungen',
      component: Veranstaltungen
    },
    {
      path: '/news',
      name: 'News',
      component: News
    },
    {
      path: '/studierendenwerk',
      name: 'Studierendenwerk',
      component: Studierendenwerk
    }
  ]
})

/**/
