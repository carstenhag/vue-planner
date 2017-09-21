<template lang="pug">
  .hello
    h1 StuV Kalendar
    button(v-on:click="testCal()") update

    ul.list
      li(v-for="(event, index) in getEvents")
        p.summary(v-text="getAttribute('summary', index)")
        p.dozent(v-text="getAttribute('description', index)")
        p.location(v-text="getAttribute('location', index)")
        p(v-text="formatTime(getAttribute('dtstart', 1)) + ' - ' + formatTime(getAttribute('dtend', 1))")

</template>

<script>
  var Ical = require('ical.js')

  export default {
    name: 'hello',
    data () {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    },
    computed: {
      getEvents () {
        return this.$store.state.events
      }
    },
    methods: {
      testCal () {
        this.$http.get('https://stuv.chagemann.de/inf16b.ics').then(response => {
          this.icsData = response.body

          let parsedEvents = Ical.parse(this.icsData)[2].slice(1)
          this.$store.commit('updateEvents', parsedEvents)

          //console.log(parsedEvents[1][1][8][3]) // 1 1 8 3  // Line #8, how does this make sense
        }, response => {
          console.log(response)
        })
      },
      getAttribute (attribute, index) {
        var events = this.getEvents[index][1]

        for (let item of events) {
          if (item[0] === attribute) {
            return item[3]
          }
        }
      },
      formatTime (time) {
        return this.$options.filters.formatDate(time)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
