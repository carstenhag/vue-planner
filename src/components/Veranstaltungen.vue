<template lang="pug">
  .veranstaltungen
    ul.events
      li(v-for="event in getEvents")
        p.title(v-text="formatDateLong(event.start.dateTime) + ' ' + formatDateHourMinutes(event.start.dateTime) +  ' – ' + formatDateHourMinutes(event.end.dateTime) ")
        p.description(v-text="event.description")
</template>

<script>
  import moment from 'moment'

  export default {
    name: 'Veranstaltungen',
    data () {
      return {
      }
    },
    metaInfo: {
      title: 'Veranstaltungen'
    },
    created () {
      this.parseCalendar()
    },
    computed: {
      getEvents () {
        return this.$store.state.events
      }
    },
    methods: {
      parseCalendar () {
        let URL = 'https://www.googleapis.com/calendar/v3/calendars/asta.dhbw.de_08mkcuqcrppq8cg8vlutdsgpjg@group.calendar.google.com/events'
        URL += '?key=AIzaSyC6mAcPZYgvYcWW_2w5e3Oy7LOHfj-wTMM'

        this.$http.get(URL).then(response => {
          const data = response.body
          let events = data.items

          events = this.filterOldEvents(events)
          console.log(events)

          this.$store.commit('updateEvents', events)
        }, response => {
          console.log(response)
        })
      },
      formatDateLong (time) {
        return this.$options.filters.formatDateToMonthDay(time)
      },
      formatDateHourMinutes (time) {
        return this.$options.filters.formatDateToHour(time)
      },
      printElement (el) {
        console.log(el)
        return el
      },
      filterOldEvents (events) {
        let filteredEvents = []
        for (let event of events) {
          // Filter out events with weird timestamp and events older than 7 days
          // TODO: Don't just ignore all events without (presumably) hour - all-day events?
          if (event.start.dateTime !== undefined &&
              moment().subtract(7, 'days').isSameOrBefore(event.start.dateTime, 'day')) {
            filteredEvents.push(event)
          }
        }
        return filteredEvents
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '../stylus/colors.styl'

  .events,
    text-align center
    max-width: 600px
    margin: 0 auto

    li
      display block
      background-color: secondaryColor
      color white
      width: 90%
      margin 10px auto
      border-radius 2px
      box-shadow: 0px 0px 14px 0px rgba(0,0,0,0.25);


      p.title
        margin 0
        padding 1rem 0.4rem 0

      p.description
        padding 0 0.4rem 1rem
        //Preserve newlines from the calendar https://stackoverflow.com/a/36729761/3991578
        white-space: pre-wrap;
        word-wrap: break-word;
        font-family: inherit;


</style>
