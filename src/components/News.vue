<template lang="pug">
  .news
    ul.posts
      li(v-for="post in getPosts")
        p(v-html="post.content.rendered")
</template>

<script>
  export default {
    name: 'News',
    data () {
      return {
      }
    },
    metaInfo: {
      title: 'News'
    },
    created () {
      this.parseNews()
    },
    computed: {
      getPosts () {
        return this.$store.state.posts
      }
    },
    methods: {
      parseNews () {
        // API Reference: https://developer.wordpress.org/rest-api/reference/posts/
        const URL = 'https://stuv-mosbach.de/wp-json/wp/v2/posts?per_page=10'
        this.$http.get(URL).then(response => {
          const data = response.body
          let posts = data
          posts = this.modifyPosts(posts)
          this.$store.commit('updatePosts', posts)
        }, response => {
          console.log(response)
        })
      },
      modifyPosts (posts) {
        let modifiedPosts = JSON.parse(JSON.stringify(posts))
        for (let i in posts) {
          if (posts[i].content.rendered.substring(0, 7) === '<p><img') {
            let newContent = posts[i].content.rendered.substring(3)
            let indexImgClose = newContent.indexOf('/>')

            newContent = newContent.substring(0, indexImgClose + 2) + '<p>' + newContent.substring(indexImgClose + 2)
            modifiedPosts[i].content.rendered = newContent
          }
        }
        return modifiedPosts
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '../stylus/colors.styl'

  .posts
    text-align center
    max-width: 600px
    margin: 0 auto

    li
      display block
      background-color: secondaryColor
      color white
      width: 90%
      margin 10px auto
      padding 10px 10px
      border-radius 2px
      box-shadow: 0px 0px 14px 0px rgba(0,0,0,0.25);
</style>

<<style lang="stylus">
  img
    max-width: 300px
    height: auto
</style>