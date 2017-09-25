<template lang="pug">
  .home
    br
    br
    img.stuv(src="https://stuv-mosbach.de/survival/design/images/StuPa.jpg")
    p Herzlich Willkommen auf der Vorlesungs-WebApp der StuV!
    p Für alle Android-Smartphonebesitzer gibt's die Vorlesungspläne auch als App im Playstore:
    a(href='https://play.google.com/store/apps/details?id=de.stuv_mosbach.stuvapp', target='_blank')
      img#googleplay(alt='Android app on Google Play', src='https://stuv-mosbach.de/survival/design/images/de-play-badge.png')

</template>

<script>
  export default {
    name: 'Home',
    data () {
      return {
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '../stylus/colors.styl'

  .stuv
    width: 40%
  #googleplay
    width: 185px

</style>
