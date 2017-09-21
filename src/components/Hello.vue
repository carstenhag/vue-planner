<template lang="pug">
  .hello
    h1 StuV Kalendar
    button(v-on:click="parseCalendar()") update

    ul.list
      li(v-for="(event, index) in getEvents")
        p.summary(v-text="getAttribute('summary', index)")
        p.dozent(v-text="getAttribute('description', index)")
        p.location(v-text="getAttribute('location', index)")
        p(v-text="formatDateHourMinutes(getAttribute('dtstart', index)) + ' - ' + formatDateHourMinutes(getAttribute('dtend', index))")
        p(v-text="formatDateLong(getAttribute('dtstart', index))")
        p(v-text="timeUntilEnd(getAttribute('dtstart', index), getAttribute('dtend', index))")

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
      }
    },
    methods: {
      parseCalendar () {
        this.$http.get('https://stuv.chagemann.de/inf16b.ics').then(response => {
          this.icsData = response.body

          let parsedEvents = Ical.parse(this.icsData)[2].slice(1, -1) //unsure if also applies to other curses
          this.$store.commit('updateEvents', parsedEvents)
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
