<template lang="pug">
  #app
    nav
      ul
        //li
          router-link(to="/aktuell") Aktuell
        li
          router-link(to="/vorlesungen") Vorlesungen
        //li
          router-link(to="/veranstaltungen") Veranstaltungen
        //li
          router-link(to="/news") News
        li
          router-link(to="/studierendenwerk") Studierendenwerk
        li
          router-link(to="/ueber") Über
    router-view
    br
    a#github(href="https://github.com/carstenhag/vue-planner")
      span Das Projekt auf Github
</template>

<script>
export default {
  name: 'app',
  metaInfo: {
    title: 'Home',
    titleTemplate: '%s | Planner für DHBW Mosbach',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ]
  }
}
</script>

<style lang="stylus">
  @import 'stylus/colors.styl'

  body
    @media screen and (max-width: 800px)
      margin 0
  #app
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased
    -moz-osx-font-smoothing: grayscale
    text-align: center
    color: #2c3e50
    margin-top: 20px

    @media screen and (max-width: 800px)
      margin-top 0

  h1, h2
    font-weight: normal

  ul
    list-style-type: none
    padding: 0

  nav li
    display: inline-block
    margin: 0 10px

  a
    background-color: lighten(secondaryColor, 10)
    color: white
    padding 5px 12px
    border-radius 2px
    text-decoration: none
</style>
