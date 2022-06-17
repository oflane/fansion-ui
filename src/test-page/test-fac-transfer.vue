<!--
 --添加注释
 --author Paul.Yang E-mail:yaboocn@qq.com
 --version 1.0 202022/6/9
 -->
<template>
  <div style="width: 80%;margin: auto;">
    <fac-transfer :data="list" :selected="selected"/>
    <rawDisplayer class="col-3" :value="list" title="List" />
  </div>
</template>
<script>
  import facTransfer from '../containers/fac-transfer'
  import rawDisplayer from './raw-displayer'
  export default {
    name: 'TestFacTransfer',
    props: {},
    components: {
      facTransfer,
      rawDisplayer
    },
    data () {
      return {
        selected: [],
        list: [
          {value: 1, label: '列表1' },
          {value: 2, label: '列表2' },
          {value: 3, label: '列表3' },
          {value: 4, label: '列表4' },
          {value: 5, label: '列表5' },
          {value: 6, label: '列表6' }
        ]
      }
    },
    methods: {}
  }
</script>
