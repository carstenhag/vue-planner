<template lang="pug">
  .home
    br
    br
    div.container
      img.dhbw(src="http://www.dhbw.de/fileadmin/_processed_/csm_2015_11_Auszeichnung_Neubau_DHBW_Mosbach_gross_c5c29ab8bc.jpg")
      p.source Quelle:&nbsp;
        a(href="http://www.dhbw.de/en/die-dhbw/aktuelles/detail/2015/11/architektur-schafft-lebensqualitaet-neubau-der-dhbw-mosbach-erhaelt-auszeichnung.html") DHBW Mosbach
      br
      p Herzlich Willkommen auf den Planner für die DHBW Mosbach!

</template>

<script>
  export default {
    name: 'Home',
    data () {
      return {
      }
    },
    metaInfo: {
      title: 'Home'
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
