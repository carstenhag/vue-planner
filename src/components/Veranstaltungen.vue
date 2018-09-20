<template lang="pug">
  .veranstaltungen
    p.source Quelle: StuV-Kalendar
    ul.events
      li(v-for="event in getEvents")
        p.title(v-text="buildEventTitle(event)")
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
        // https://calendar.google.com/calendar/r/month/2018/9/12?eid=MWxjY2xndTNkMTY3cGYxN3E4MWU2NTlidWogYXN0YS5kaGJ3LmRlXzA4bWtjdXFjcnBwcThjZzh2bHV0ZHNncGpnQGc&ctz=Europe/Berlin&pli=1&sf=true
        let URL = 'https://www.googleapis.com/calendar/v3/calendars/asta.dhbw.de_08mkcuqcrppq8cg8vlutdsgpjg@group.calendar.google.com/events'
        URL += '?key=AIzaSyC6mAcPZYgvYcWW_2w5e3Oy7LOHfj-wTMM'

        this.$http.get(URL).then(response => {
          const data = response.body
          let events = data.items

          events = this.filterOldEvents(events)
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
      buildEventTitle (event) {
        if (event.start.date) {
          return this.formatDateLong(event.start.date)
        } else {
          return this.formatDateLong(event.start.dateTime) + ' ' + this.formatDateHourMinutes(event.start.dateTime) + ' – ' + this.formatDateHourMinutes(event.end.dateTime)
        }
      },
      printElement (el) {
        console.log(el)
        return el
      },
      filterOldEvents (events) {
        let filteredEvents = []
        for (let event of events) {
          // Filter out events with weird timestamp and events older than 7 days
          // refactor to make prettier
          if (event.start.dateTime !== undefined && moment().subtract(7, 'days').isSameOrBefore(event.start.dateTime, 'day') ||
              (event.start.date !== undefined && moment().subtract(7, 'days').isSameOrBefore(event.start.date, 'day'))) {
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
    max-width: 800px
    margin: 0 auto

    li
      display block
      box-sizing: border-box;  // https://stackoverflow.com/a/32502321/3991578
      background-color: secondaryColor
      color white
      width: 100%
      margin 10px auto 20px
      padding 10px 10px
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

  @media screen and (max-width: 800px)
    .events li
      width: 90%

</style>
