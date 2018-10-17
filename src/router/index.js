import Vue from 'vue'
import Router from 'vue-router'
import Ueber from '@/components/Ueber'
import Aktuell from '@/components/Aktuell'
import Vorlesungen from '@/components/Vorlesungen'
import Veranstaltungen from '@/components/Veranstaltungen'
import News from '@/components/News'
import Studierendenwerk from '@/components/Studierendenwerk'
import Meta from 'vue-meta'

Vue.use(Router)
Vue.use(Meta)

export default new Router({
  // https://router.vuejs.org/en/essentials/history-mode.html Enable history mode so the ugly # dissapears from the URL
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: { name: 'Vorlesungen' }
    },

    {
      path: '/aktuell',
      name: 'Aktuell',
      component: Aktuell
    },
    {
      path: '/vorlesungen',
      name: 'Vorlesungen',
      component: Vorlesungen
    },
    {
      path: '/vorlesungen/:course',
      name: 'Vorlesungen with course',
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
    },
    {
      path: '/ueber',
      name: 'Ueber',
      component: Ueber
    }
  ]
})
