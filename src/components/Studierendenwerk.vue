<template lang="pug">
  .studierendenwerk
    ul.studi-links
      br
      br
      li.mensa: a(href="https://docs.google.com/gview?embedded=true&url=http://www.studentenwerk.uni-heidelberg.de/sites/default/files/download/pdf/sp-mos-mensa-aktuell.pdf" target="_blank") Mensaplan öffnen
      br
      li: a(href="http://www.stw.uni-heidelberg.de/de/" target="_blank") Webseite des Studierendenwerkes
      li: a(href="http://www.stw.uni-heidelberg.de/de/essen_trinken" target="_blank") Essen & Trinken
      li: a(href="http://www.stw.uni-heidelberg.de/de/wohnen" target="_blank") Wohnen
      li: a(href="http://www.stw.uni-heidelberg.de/de/bafoeg" target="_blank") BAföG & Studienfinanzierung
      li: a(href="http://www.stw.uni-heidelberg.de/de/beratung" target="_blank") Beratung & Service
      li: a(href="http://www.stw.uni-heidelberg.de/de/kultur" target="_blank") Kultur & Veranstaltungen
      li: a(href="http://www.stw.uni-heidelberg.de/de/studieren_mit_kind" target="_blank") Studieren mit Kind
      li: a(href="http://www.stw.uni-heidelberg.de/de/international" target="_blank") International

    br
    br
</template>

<script>
  export default {
    name: 'Studierendenwerk',
    data () {
      return {
      }
    },
    metaInfo: {
      title: 'Studierendenwerk'
    }
  }
</script>

<style scoped lang="stylus">

  @import '../stylus/colors.styl'

  .studi-links
    max-width: 600px
    margin 0 auto

    li
      display inline-block
      padding 12px 0
      width: 50%;
      vertical-align: middle;

  .mensa
    margin-bottom 40px


</style>
