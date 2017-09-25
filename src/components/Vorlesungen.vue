<template lang="pug">
  .hello
    h1(v-text="'Kurs ' + selectedCourse")

    select(v-model="selectedCourse" v-bind:disabled="!isCourseListLoaded")
      option(value="" hidden disabled selected) Kurs auswählen
      template(v-for="(course, key) in getCourseList")
        option(v-bind:value="key") {{key}}


    input(type='button' v-on:click="parseCalendar()" value="Aktualisieren")
    input(type='button' v-on:click="showPast ? showPast=false : showPast=true" v-bind:value="showPast ? 'Vergangene ausblenden' : 'Vergangene anzeigen'")
    p(v-if="timeNetwork[0] && timeNetwork[1]" v-text="'timeNetwork: ' + timeNetwork.join('ms ') + 'ms'")
    p(v-if="timeParse" v-text="'timeParse: ' + timeParse + 'ms'")
    p(v-if="timeGroup" v-text="'timeGroup: ' + timeGroup + 'ms'")
    p(v-else)

    p(v-if="selectedCourse === ''") Bitte wähle einen Kurs aus der Liste aus.

    table
      tbody
        template(v-for="eventsInOneDay in getEventsGroupedByDate")
          template(v-if="showPast || eventInThePast(getAttribute(eventsInOneDay[0], 'dtend'))")
            tr.day
              td(v-text="formatDateLong(getAttribute(eventsInOneDay[0], 'dtstart'))" colspan='4')

            tr.event(v-for="event in eventsInOneDay" v-bind:class="{studyday: getAttribute(event, 'summary') === 'Studientag'}")
              td.time(v-text="formatDateHourMinutes(getAttribute(event, 'dtstart')) + ' - ' + formatDateHourMinutes(getAttribute(event, 'dtend'))")
              td.summary
                p(v-text="getAttribute(event, 'summary')")
                span.timeleft(v-text="timeUntilEnd(getAttribute(event, 'dtstart'), getAttribute(event, 'dtend'))")
              td.dozent(v-text="getAttribute(event, 'description')")
              td.location(v-text="getAttribute(event, 'location')")

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
        //title: 'Home',
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
      this.parseCourseList()
    },
    computed: {
      'selectedCourse': {
        get () {
          return this.$store.state.selectedCourse
        },
        set (value) {
          this.$store.commit('updateSelectedCourse', value)
          this.parseCalendar()
        }
      },
      getEvents () {
        return this.$store.state.events
      },
      // Creates a new object with events grouped by the same date, to make the display easier
      getEventsGroupedByDate () {
        return this.$store.state.groupedEvents
      },
      getCourseList () {
        return this.$store.state.courseList
      },
      groupEventsByDate () {
        const t1 = performance.now()

        let groupedEvents = {}

        for (let event of this.getEvents) {
          let currentFormattedDate = this.formatDateLong(this.getAttribute(event, 'dtstart'))
          if (groupedEvents[currentFormattedDate] === undefined) {
            groupedEvents[currentFormattedDate] = []
          }
          groupedEvents[currentFormattedDate].push(event)
        }

        const t2 = performance.now()
        this.timeGroup = ('' + (t2 - t1)).substring(0, 5)
        return groupedEvents
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

          const parsedEvents = Ical.parse(icsData)[2].slice(1, -1) // not sure if also applies to other curses
          this.$store.commit('updateEvents', parsedEvents) // do we even need normal events persisted anymore?
          const t3 = performance.now()
          this.timeParse = ('' + (t3 - t2)).substring(0, 5)

          // not sure if these should be here
          this.$store.commit('updateGroupedEvents', this.groupEventsByDate)
          this.parseCourseList()
        }, response => {
          console.log(response)
        })
      },
      parseCourseList () {
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
        }, response => {
          console.log(response)
        })
      },
      getAttribute (event, attribute) {
        for (let item of event[1]) {
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
          return 'Vorlesung zuende ' + moment().to(endTime)
        }
      },
      eventInThePast (endTime) {
        return moment().isSameOrBefore(moment(endTime), 'day')
      },
      // https://stackoverflow.com/a/31102605/3991578
      sortJSONByKey (unordered) {
        let ordered = {}
        Object.keys(unordered).sort().forEach(key => {
          ordered[key] = unordered[key]
        })
        return ordered
      }
    }
  }
</script>

<style scoped lang="stylus">

  @import('../stylus/colors.styl')

  .hello
    width 800px
    margin 0 auto
    text-align left
    h1
      background-color: secondaryColor
      color white
      font-size 1.2rem
      display inline-block
      padding 8px 12px
      margin-right 20px


  table
    text-align left
    width 800px
    margin 0 auto
    border-spacing 0
    box-shadow: 0px 0px 14px 0px rgba(0,0,0,0.55);


    tr td
      padding: 10px 0

    tr.event td:first-child
      padding-left 16px

    p
      padding 0
      margin 0

  .day td
    background-color: tableDayBackgroundColor
    text-align center


  .timeleft
    color green

  .hello
    input[type=button]
      margin 0 16px

  input[type=button]
    background-color: primaryColor
    color: white
    border 0
    padding 8px 12px
    border-radius 2px
    -webkit-appearance: none // WHY APPLE

    &:hover
      background-color: lighten(primaryColor, 3)
      cursor: click
</style>
