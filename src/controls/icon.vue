<template>
  <i v-if="!isImage" :class="url"/>
  <img v-if="isImage" :src="url" alt=""/>
</template>
<script>
  export default {
    name: 'FacIcon',
    props: {
      url: String
    },
    data () {
      const isImage = this.url.startsWith("http")
      return {
        isImage
      }
    }
  }
</script>
