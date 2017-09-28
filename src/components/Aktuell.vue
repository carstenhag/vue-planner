<template lang="pug">
  .aktuell
    p Noch nicht implementiert.
    //p(v-if="dataUnavailable") Bitte das erste mal die Veranstaltungen und die Vorlesungen aktualisieren.
    //template(v-else)
      p Geht noch nicht ¯\_(ツ)_/¯
</template>

<script>
  export default {
    name: 'Aktuell',
    data () {
      return {
        dataUnvailable: true
      }
    },
    metaInfo: {
      title: 'Aktuell'
    },
    computed: {
      getEvents () {
        return this.$store.state.events
      },
      getLecturesGroupedByDate () {
        return this.$store.state.groupedLectures
      }
    },
    created () {
      this.updateDataStatus()
    },
    methods: {
      updateDataStatus () {
        console.log(this.getEvents)
        console.log(this.getLecturesGroupedByDate)
        // https://stackoverflow.com/a/4994265/3991578
        if (this.getEvents.length === 0 || Object.keys(this.getLecturesGroupedByDate).length === 0) {
          this.dataUnavailable = true
        } else {
          this.dataUnavailable = false
        }
      },
      printElement (el) {
        console.log(el)
        return el
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '../stylus/colors.styl'



</style>
