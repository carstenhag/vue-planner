<template lang="pug">
  .hello
    h1.kurs-header(v-text="'Kurs ' + selectedCourse")

    // Populate the select-box with option fields
    select(v-model="selectedCourse" v-bind:disabled="!isCourseListLoaded")
      // Default option to show placeholder
      option(value="" hidden disabled selected) Kurs auswählen
      // Template element to be able to iterate
      template(v-for="(course, key) in getCourseList")
        option(v-bind:value="key") {{key}}

    br

    input(type='button' v-on:click="parseCalendar()" value="Aktualisieren")
    input(type='button' v-on:click="showPast ? showPast=false : showPast=true" v-bind:value="showPast ? 'Vergangene ausblenden' : 'Vergangene anzeigen'")
    span.source Quelle: DHBW Mosbach

    p(v-if="selectedCourse === ''") Bitte wähle einen Kurs aus der Liste aus.

    ul
        // Nested template to make lines shorter
        template(v-for="lecturesInOneDay in getLecturesGroupedByDate")
          // Toggled rendering of past lectures
          template(v-if="showPast || lectureInThePast(getAttribute(lecturesInOneDay[0], 'dtend'))")
            li.day
              // First element of an individual date always exists, use it for the "day" header
              p.day-header(v-text="formatDateLong(getAttribute(lecturesInOneDay[0], 'dtstart'))" colspan='4')

              template(v-for="lecture in lecturesInOneDay")
                // Render lectures, apply studyday class if applicable
                .lecture(v-bind:class="{studyday: getAttribute(lecture, 'summary') === 'Studientag'}")
                  span.time(v-text="formatDateHourMinutes(getAttribute(lecture, 'dtstart')) + ' - ' + formatDateHourMinutes(getAttribute(lecture, 'dtend'))")
                  span.summary
                    span(v-text="getAttribute(lecture, 'summary')")
                    // If the lecture is ongoing, show the remaining time
                    span.timeleft(v-text="timeUntilEnd(getAttribute(lecture, 'dtstart'), getAttribute(lecture, 'dtend'))")
                  span.dozent(v-text="getAttribute(lecture, 'description')")
                  span.location(v-text="getAttribute(lecture, 'location')")
                // If there is more than 1 lecture in a day, print a hr. Don't print if current element is the last one.
                // We only want hr between lectures, not at the beginning or the end.
                hr.lecture-delimiter(v-if="lecturesInOneDay.length > 1 && lecture != lecturesInOneDay[lecturesInOneDay.length - 1]")

    br
</template>

<script>
  const Ical = require('ical.js')

  import moment from 'moment'

  export default {
    name: 'Vorlesungen',
    data () {
      return {
        timeNetwork: [],
        timeParse: '',
        timeGroup: '',
        showPast: false,
        isCourseListLoaded: false
      }
    },
    metaInfo () {
      return {
        title: 'Vorlesungen ' + this.selectedCourse
      }
    },
    mounted () {
      let handleRoute = function () {
        let parameterCourse = this.$route.params.course
        if (parameterCourse !== undefined && this.getCourseList.hasOwnProperty(parameterCourse.toUpperCase())) {
          this.selectedCourse = parameterCourse.toUpperCase()
        } else {
          console.log(parameterCourse + ' not in list')
        }
      }

      this.parseCourseList(handleRoute)
    },
    computed: {
      'selectedCourse': {
        get () {
          return this.$store.state.selectedCourse
        },
        set (value) {
          this.$router.push('/vorlesungen/' + value)
          this.$store.commit('updateSelectedCourse', value)
          this.parseCalendar()
        }
      },
      getLectures () {
        return this.$store.state.lectures
      },
      // Creates a new object with lectures grouped by the same date, to make the display easier
      getLecturesGroupedByDate () {
        return this.$store.state.groupedLectures
      },
      getCourseList () {
        return this.$store.state.courseList
      },
      groupLecturesByDate () {
        const t1 = performance.now()

        let groupedLectures = {}

        for (let lecture of this.getLectures) {
          let currentFormattedDate = this.formatDateLong(this.getAttribute(lecture, 'dtstart'))
          if (groupedLectures[currentFormattedDate] === undefined) {
            groupedLectures[currentFormattedDate] = []
          }
          groupedLectures[currentFormattedDate].push(lecture)
        }

        const t2 = performance.now()
        this.timeGroup = ('' + (t2 - t1)).substring(0, 5)
        return groupedLectures
      }
    },
    methods: {
      // should probably split into an update() method
      parseCalendar () {
        const t1 = performance.now()

        let URL = this.getCourseList[this.selectedCourse]
        URL = URL.replace('http://ics.mosbach.dhbw.de/', 'https://proxy.chagemann.de/')

        this.$http.get(URL).then(response => {
          const t2 = performance.now()
          this.timeNetwork[0] = ('' + (t2 - t1)).substring(0, 5)
          const icsData = response.body

          const parsedLectures = Ical.parse(icsData)[2].slice(1, -1) // not sure if also applies to other curses
          this.$store.commit('updateLectures', parsedLectures) // do we even need normal lectures persisted anymore?
          const t3 = performance.now()
          this.timeParse = ('' + (t3 - t2)).substring(0, 5)

          // not sure if these should be here
          this.$store.commit('updateGroupedLectures', this.groupLecturesByDate)
          this.parseCourseList() // FIX: Update this only if URL is undefined
        }, response => {
          console.log(response)
        })
      },
      parseCourseList (callback) {
        const t1 = performance.now()

        this.$http.get('https://proxy.chagemann.de/ics/calendars.list').then(response => {
          const t2 = performance.now()
          this.timeNetwork[1] = ('' + (t2 - t1)).substring(0, 5)
          const data = response.body
          const lines = data.split('\n')
          let courseList = {}
          for (let line of lines) {
            let lineSplit = line.split(';')
            if (lineSplit[0].length !== 0 && lineSplit !== 'CALENDARS') {
              courseList[lineSplit[0]] = lineSplit[1]
            }
          }
          courseList = this.sortJSONByKey(courseList)
          this.$store.commit('updateCourseList', courseList)
          this.isCourseListLoaded = true

          if (callback !== undefined) {
            callback.apply(this)
          }
        }, response => {
          console.log(response)
        })
      },
      getAttribute (lecture, attribute) {
        for (let item of lecture[1]) {
          if (item[0] === attribute) {
            return item[3]
          }
        }
      },
      printElement (el) {
        console.log(el)
        return el
      },
      formatDateHourMinutes (time) {
        return this.$options.filters.formatDateToHour(time)
      },
      formatDateLong (time) {
        return this.$options.filters.formatDateToMonthDay(time)
      },
      timeUntilEnd (startTime, endTime) {
        if (moment().isBetween(moment(startTime), moment(endTime))) {
          return 'Vorlesung zu Ende ' + moment().to(endTime)
        }
      },
      lectureInThePast (endTime) {
        return moment().isSameOrBefore(moment(endTime), 'day')
      },
      // https://stackoverflow.com/a/31102605/3991578
      sortJSONByKey (unordered) {
        let ordered = {}
        Object.keys(unordered).sort().forEach(key => {
          ordered[key] = unordered[key]
        })
        return ordered
      },
      clearLocalStorage () {
        localStorage.clear()
      }
    }
  }
</script>

<style type="text/stylus" scoped lang="stylus">

  @import '../stylus/colors.styl'

  .hello
    max-width 800px
    margin 0 auto
    text-align left
    h1
      background-color: secondaryColor
      color white
      font-size 1.2rem
      display inline-block
      padding 8px 12px
      margin-right 20px

  .kurs-header, .source
    margin-left: 8px

  .day
    display: inline-block
    width: 100%
    margin 6px 0
    background-color secondaryColor
    color: white
    box-shadow: 0px 0px 14px 0px rgba(0,0,0,0.05);

  .day-header
    background-color: lighten(secondaryColor, 10)
    text-align center
    margin 0
    padding 6px 2px

  .lecture
    display: grid
    grid-template-columns: 15% 50% 20% 15%
    margin: 8px 0

    :first-child
      margin-left: 8px

    :last-child
      margin-right: 8px

  .timeleft
    color green

  .lecture-delimiter
    margin: 0
    border: 1px solid lighten(secondaryColor, 5);

  @media screen and (max-width: 800px)

    .day-header
      font-size: 1.1rem
    .lecture
      display: flex
      flex-wrap: wrap
      .summary
        order 1
        width: 100%
        font-size: 1.1rem
        font-weight: 500
      .time
        order 2
        width: 100%
      .location
        order 3
        width: 50%
        margin-left: 8px
      .dozent
        order 4
        width: calc(50% - 16px - 8px)
        text-align: right

  .hello
    input[type=button]
      margin 0 16px 16px

      @media screen and (max-width: 800px)
        margin-bottom 8px

  input[type=button]
    background-color: primaryColor
    color: white
    border 0
    padding 8px 12px
    border-radius 2px
    -webkit-appearance: none // WHY APPLE
    font-size 0.8rem

    &:hover
      background-color: lighten(primaryColor, 3)
      cursor: click

  .timers p
    padding-left 8px
</style>
