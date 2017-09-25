import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export const store = new Vuex.Store({
  plugins: [createPersistedState({key: 'vuex-stuv-0.1.0'})],
  state: {
    lectures: [],
    groupedLectures: {}, // without this it didn't get persisted after a refresh
    courseList: {},
    selectedCourse: ''
  },
  mutations: {
    updateLectures (state, payload) {
      state.lectures = payload
    },
    updateGroupedLectures (state, payload) {
      state.groupedLectures = payload
    },
    updateCourseList (state, payload) {
      state.courseList = payload
    },
    updateSelectedCourse (state, payload) {
      state.selectedCourse = payload
    }
  }
})
