<template>
  <i v-if="!isImage" :class="realUrl"/>
  <img v-if="isImage" :src="realUrl" :alt="this.alt"/>
</template>
<script>
  export default {
    name: 'FacIcon',
    props: {
      url: String,
      alt: String,
      defaultUrl: {
        type: String,
        default: 'fa fa-image'
      }
    },
    data () {
      const realUrl = this.url || this.defaultUrl
      const isImage = realUrl.startsWith("http")
      return {
        realUrl,
        isImage
      }
    }
  }
</script>
