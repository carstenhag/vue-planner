<template lang="pug">
  .hello
    h1 StuV Kalendar - INF16B
    button(v-on:click="parseCalendar()") Aktualisieren!
    button(v-on:click="showPast ? showPast=false : showPast=true") Vergangene anzeigen
    p(v-if="timeNetwork" v-text="'timeNetwork: ' + timeNetwork + 'ms'")
    p(v-if="timeParse" v-text="'timeParse: ' + timeParse + 'ms'")
    p(v-if="timeGroup" v-text="'timeGroup: ' + timeGroup + 'ms'")

    br

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

              // 5 minuten bis Ende


</template>

<script>
  var Ical = require('ical.js')

  import moment from 'moment'

  export default {
    name: 'hello',
    data () {
      return {
        timeNetwork: '',
        timeParse: '',
        timeGroup: '',
        showPast: false
      }
    },
    computed: {
      getEvents () {
        return this.$store.state.events
      },
      // Creates a new object with events grouped by the same date, to make the display easier
      getEventsGroupedByDate () {
        return this.$store.state.groupedEvents
      },
      groupEventsByDate () {
        let t1 = performance.now()

        let groupedEvents = {}

        for (let event of this.getEvents) {
          let currentFormattedDate = this.formatDateLong(this.getAttribute(event, 'dtstart'))
          if (groupedEvents[currentFormattedDate] === undefined) {
            groupedEvents[currentFormattedDate] = []
          }
          groupedEvents[currentFormattedDate].push(event)
        }

        let t2 = performance.now()
        this.timeGroup = ('' + (t2 - t1)).substring(0, 5)
        return groupedEvents
      }
    },
    methods: {
      parseCalendar () {
        let t1 = performance.now()
        this.$http.get('https://static.chagemann.de/inf16b.ics').then(response => {
          let t2 = performance.now()
          this.timeNetwork = ('' + (t2 - t1)).substring(0, 5)
          this.icsData = response.body

          let parsedEvents = Ical.parse(this.icsData)[2].slice(1, -1) // not sure if also applies to other curses
          this.$store.commit('updateEvents', parsedEvents) // do we even need normal events persisted anymore?
          let t3 = performance.now()
          this.timeParse = ('' + (t3 - t2)).substring(0, 5)
          this.$store.commit('updateGroupedEvents', this.groupEventsByDate) // not sure if this should be here
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
        let m = moment(endTime)
        return moment().isSameOrBefore(m, 'day')
      }
    }
  }
</script>

<style scoped lang="stylus">

  table
    text-align left
    width 900px
    margin 0 auto

    td
      padding-left 8px

    p
      padding 0
      margin 0

  .day td
    background-color: #D7DADC
    text-align center

  .timeleft
    color green

</style>
