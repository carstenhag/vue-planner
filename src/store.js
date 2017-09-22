import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export const store = new Vuex.Store({
  plugins: [createPersistedState({key: 'vuex-stuv'})],
  state: {
    events: [],
    groupedEvents: {}, // without this it didn't get persisted after a refresh
    courseList: {}
  },
  mutations: {
    updateEvents (state, payload) {
      state.events = payload
    },
    updateGroupedEvents (state, payload) {
      state.groupedEvents = payload
    },
    updateCourseList (state, payload) {
      state.courseList = payload
    }
  }
})
