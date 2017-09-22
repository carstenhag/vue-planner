<template lang="pug">
  .hello
    h1 StuV Kalendar - INF16B
    button(v-on:click="parseCalendar()") Aktualisieren!
    p(v-if="timeParse" v-text="'timeParse: ' + timeParse + 'ms'")
    p(v-if="timeGroup" v-text="'timeGroup: ' + timeGroup + 'ms'")

    br

    table
      tbody
        //p(v-text="printElement(getEventsGroupedByDate)")
        template(v-for="eventsInOneDay in getEventsGroupedByDate")
          tr.day
            td(v-text="formatDateLong(getAttribute(eventsInOneDay[0], 'dtstart'))" colspan='4')

          tr.event(v-for="event in eventsInOneDay" v-bind:class="{studyday: getAttribute(event, 'summary') === 'Studientag'}")
            td.time(v-text="formatDateHourMinutes(getAttribute(event, 'dtstart')) + ' - ' + formatDateHourMinutes(getAttribute(event, 'dtend'))")
            td.summary(v-text="getAttribute(event, 'summary')")
            td.dozent(v-text="getAttribute(event, 'description')")
            td.location(v-text="getAttribute(event, 'location')")

            // 5 minuten bis Ende
            //td(v-text="timeUntilEnd(getAttribute('dtstart', event[3].originalIndex), getAttribute('dtend', event[3].originalIndex))")

</template>

<script>
  var Ical = require('ical.js')

  import moment from 'moment'

  export default {
    name: 'hello',
    data () {
      return {
        timeParse: '',
        timeGroup: ''
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
          this.icsData = response.body

          let parsedEvents = Ical.parse(this.icsData)[2].slice(1, -1) // not sure if also applies to other curses
          this.$store.commit('updateEvents', parsedEvents) // do we even need normal events persisted anymore?
          let t2 = performance.now()
          this.timeParse = ('' + (t2 - t1)).substring(0, 5)
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

  .day td
    background-color: #D7DADC
    text-align center

</style>
