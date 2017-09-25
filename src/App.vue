<template lang="pug">
  #app
    nav
      ul
        li
          router-link(to="/") Home
        li
          router-link(to="/aktuell") Aktuell
        li
          router-link(to="/vorlesungen") Vorlesungen
        li
          router-link(to="/veranstaltungen") Veranstaltungen
        li
          router-link(to="/news") News
        li
          router-link(to="/studierendenwerk") Studierendenwerk
    router-view
    br
    a#github(href="https://github.com/carstenhag/vue-stuv")
      p Das Projekt auf Github
</template>

<script>
export default {
  name: 'app',
  metaInfo: {
    title: 'Home',
    titleTemplate: '%s | StuV Survival'
  }
}
</script>

<style lang="stylus">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

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
