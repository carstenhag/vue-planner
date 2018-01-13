<template lang="pug">
  .news
    p.source Quelle:&nbsp;
      a(href="https://stuv-mosbach.de/") StuV-Survival
    ul.posts
      li.post(v-for="post in getPosts")
        p.right(v-text="formatDateLong(post.date)")
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
        // Deep copy the array
        let modifiedPosts = JSON.parse(JSON.stringify(posts))
        for (let i in posts) {
          if (posts[i].content.rendered.indexOf('<p><img') !== -1) {
            // `<div class="useless content"><p><img     .../>some text relevant to the image</p>`
            //  ^firstPart                      ^secondPart   ^thirdPart (<p> gets moved there)
            // First occurance of the tag
            let index = posts[i].content.rendered.indexOf('<p><img')

            // First Part will usually be empty, if not for some element even before the <p><img> tags
            let firstPart = posts[i].content.rendered.substring(0, index)

            // Second Part starts at the img tag, removing the p tag from `<p><img...`
            let secondPartUnmodified = posts[i].content.rendered.substring(index + 3)

            // Look up at what index the closing bracket for the img tag is at
            let indexImgClose = secondPartUnmodified.indexOf('>')

            // Divide the second part into two pieces and add the p tag inbetween
            let secondPart = secondPartUnmodified.substring(0, indexImgClose + 1)
            let thirdPart = '<p>' + secondPartUnmodified.substring(indexImgClose + 1)

            let newContent = firstPart + secondPart + thirdPart
            modifiedPosts[i].content.rendered = newContent
          }
        }
        return modifiedPosts
      },
      formatDateLong (time) {
        return this.$options.filters.formatDateToMonthDay(time)
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '../stylus/colors.styl'

  .posts
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

  .right
    text-align right
    padding-right 20px
    padding-bottom -20px
    margin 8px 0 -8px

  @media screen and (max-width: 800px)
    .posts li
      width: 90%

</style>

<!-- Inserted HTML (each post) can not be targeted with scoped CSS -->
<style lang="stylus">
@import '../stylus/colors.styl'
  .posts li img
    max-width: 90%
    height: auto

  .post a
    color lighten(mainRed, 25)
    text-overflow: ellipsis;
    white-space: pre-wrap;
    word-wrap: break-word;
    
</style>