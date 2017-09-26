<template lang="pug">
  .hello
    h1(v-text="'Kurs ' + selectedCourse")

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
    input(type='button' v-on:click="clearLocalStorage()" value="LocalStorage löschen")
    // Various performance timers to check performance on different devices
    //.timers(v-if="timeNetwork[0] && timeNetwork[1]")
      p(v-if="timeNetwork[0] && timeNetwork[1]" v-text="'timeNetwork: ' + timeNetwork.join('ms ') + 'ms'")
      p(v-if="timeParse" v-text="'timeParse: ' + timeParse + 'ms'")
      p(v-if="timeGroup" v-text="'timeGroup: ' + timeGroup + 'ms'")
      p(v-else)

    p(v-if="selectedCourse === ''") Bitte wähle einen Kurs aus der Liste aus.

    table
      tbody
        // Nested template to make lines shorter
        template(v-for="lecturesInOneDay in getLecturesGroupedByDate")
          // Toggled rendering of past lectures
          template(v-if="showPast || lectureInThePast(getAttribute(lecturesInOneDay[0], 'dtend'))")
            // First element of an individual date always exists, use it for the "day" header
            tr.day
              td(v-text="formatDateLong(getAttribute(lecturesInOneDay[0], 'dtstart'))" colspan='4')

            // Render lectures, apply studyday class if applicable
            tr.lecture(v-for="lecture in lecturesInOneDay" v-bind:class="{studyday: getAttribute(lecture, 'summary') === 'Studientag'}")
              td.time(v-text="formatDateHourMinutes(getAttribute(lecture, 'dtstart')) + ' - ' + formatDateHourMinutes(getAttribute(lecture, 'dtend'))")
              td.summary
                p(v-text="getAttribute(lecture, 'summary')")
                // If the lecture is ongoing, show the remaining time
                span.timeleft(v-text="timeUntilEnd(getAttribute(lecture, 'dtstart'), getAttribute(lecture, 'dtend'))")
              td.dozent(v-text="getAttribute(lecture, 'description')")
              td.location(v-text="getAttribute(lecture, 'location')")

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
    //@media screen and (max-width: 800px)
      //width initial
    h1
      background-color: secondaryColor
      color white
      font-size 1.2rem
      display inline-block
      padding 8px 12px
      margin-right 20px


  table
    text-align left
    //min-width 100%
    width: 100%
    max-width 800px
    margin 0 auto
    border-spacing 0
    box-shadow: 0px 0px 14px 0px rgba(0,0,0,0.55);

    @media screen and (max-width: 800px)
      //width: initial
      box-shadow none

    tbody
      @media screen and (max-width: 800px)
        font-size 0.9rem


    tr td
      padding: 10px 0
      @media screen and (max-width: 800px)
        padding 8px 0

    tr.lecture td:first-child
      padding-left 16px

      @media screen and (max-width: 800px)
        padding-left 8px

    tr.lecture td:last-child
      @media screen and (max-width: 800px)
        padding-right 8px

    p
      padding 0
      margin 0

  .day td
    background-color: tableDayBackgroundColor
    text-align center

    @media screen and (max-width: 800px)
      font-size 1rem


  .timeleft
    color green

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
