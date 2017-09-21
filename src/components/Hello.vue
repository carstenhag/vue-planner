<template lang="pug">
  .hello
    h1 StuV Kalendar - INF16B
    button(v-on:click="parseCalendar()") Aktualisieren!

    br

    ul.list
      div(v-for="(eventsInOneDay, i) in getEventsGroupedByDate")
        p(v-text="formatDateLong(getAttribute('dtstart', eventsInOneDay[0][3].originalIndex))")

        li.test(v-for="(event, j) in eventsInOneDay")
          div
            p.summary(v-text="getAttribute('summary', event[3].originalIndex)")
            p.dozent(v-text="getAttribute('description', event[3].originalIndex)")
            p.location(v-text="getAttribute('location', event[3].originalIndex)")
            p(v-text="formatDateHourMinutes(getAttribute('dtstart', event[3].originalIndex)) + ' - ' + formatDateHourMinutes(getAttribute('dtend', event[3].originalIndex))")

            p(v-text="timeUntilEnd(getAttribute('dtstart', event[3].originalIndex), getAttribute('dtend', event[3].originalIndex))")


</template>

<script>
  var Ical = require('ical.js')

  import moment from 'moment'

  export default {
    name: 'hello',
    data () {
      return {
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
        console.time('groupEventsByDate')
        let groupedEvents = {}
        for (let i = 0; i < this.$store.state.events.length; i++) {
          let modifiedEvent = this.getEvents[i]

          // As we are grouping things together, the old indexes are no longer valid, but we need them to get attributes.
          if (!modifiedEvent.hasOwnProperty('originalindex')) {
            modifiedEvent.push({'originalIndex': i})
          }

          // not sure why i + 1 < length specifically, but we have to make sure not to check length+1 for obvious reasons
          if (i + 1 < this.getEvents.length) {
            let currentFormattedDate = this.formatDateLong(this.getAttribute('dtstart', i))
            if (currentFormattedDate === this.formatDateLong(this.getAttribute('dtstart', i + 1))) {
              if (groupedEvents[currentFormattedDate] === undefined) {
                groupedEvents[currentFormattedDate] = []
              }

              groupedEvents[currentFormattedDate].push(modifiedEvent)
            }
          }
        }
        console.timeEnd('groupEventsByDate')
        return groupedEvents
      }
    },
    methods: {
      parseCalendar () {
        this.$http.get('https://stuv.chagemann.de/inf16b.ics').then(response => {
          this.icsData = response.body

          let parsedEvents = Ical.parse(this.icsData)[2].slice(1, -1) // not sure if also applies to other curses
          this.$store.commit('updateEvents', parsedEvents) // do we even need normal events persisted anymore?

          this.$store.commit('updateGroupedEvents', this.groupEventsByDate) // not sure if this should be here
        }, response => {
          console.log(response)
        })
      },
      getAttribute (attribute, index) {
        let events = this.getEvents[index][1]

        for (let item of events) {
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
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
