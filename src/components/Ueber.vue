<template lang="pug">
  .ueber
    br
    br
    div.container
      img.dhbw(src="http://www.dhbw.de/fileadmin/_processed_/9/7/csm_2015_11_Auszeichnung_Neubau_DHBW_Mosbach_gross_a732d90e79.jpg")
      br
      p.source Quelle:&nbsp;
        a(href="http://www.dhbw.de/de/die-dhbw/aktuelles/detail/2015/11/architektur-schafft-lebensqualitaet-neubau-der-dhbw-mosbach-erhaelt-auszeichnung.html") DHBW Mosbach
      br
      p Herzlich Willkommen auf den Planner für die DHBW Mosbach!

</template>

<script>
  export default {
    name: 'Ueber',
    data () {
      return {
      }
    },
    metaInfo: {
      title: 'Über'
    }
  }
</script>

<style scoped lang="stylus">
  @import '../stylus/colors.styl'

  .container
    max-width: 650px
    margin 0 auto
    img
      width 100%
  .source
    text-align left
    margin 4px 0
</style>
