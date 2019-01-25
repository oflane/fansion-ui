<!--
 --高级查询组件
 --author Paul.Yang E-mail:yaboocn@qq.com
 --version 1.0 2017-8-29
 -->
<template>
  <div class="xquery" v-show="visible">
    <fac-form :conf="conf" :page="page" :model="advance"/>
    <div class="query-button"><el-button type="primary" @click="handleSearch">查询</el-button><el-button @click="handleClear">清空</el-button></div>
  </div>
</template>
<script>
  import form from '../containers/fac-form.vue'
  import fase from 'fansion-base'
  /**
   * 引入数据加载类
   * @type {DataLoader}
   */
  const DataLoader = fase.DataLoader

  /**
   * 高级查询组件
   * @author Paul.Yang E-mail:yaboocn@qq.com
   * @version 1.0 2018-1-22
   */
  export default {
    name: 'FacXquery',
    props: {
      conf: Object,
      loader: DataLoader,
      page: Object
    },
    data () {
      if (this.loader) {
        this.loader.addPlugin(this)
      }
      this.conf.items.forEach(v => {
        v.query = this
        v.events ? v.events['@keyup.enter.native'] = 'conf.query.handleSearch()' : v.events = {'@keyup.enter.native': 'conf.query.handleSearch()'}
      })
      return {
        visible: undefined,
        advance: {}
      }
    },
    components: {
      facForm: form
    },
    mounted () {
      if (this.visible === undefined) {
        this.visible = true
      }
    },
    methods: {
      handleSearch () {
        if (this.loader) {
          this.loader.load(true)
        }
        this.$emit('search', this)
      },
      handleClear () {
        this.advance = {}
      },
      setVisible (v) {
        this.visible = v
        let c = this.$parent.$el
        if (this.visible) {
          c.style.display = c.bakdis
        } else {
          c.bakdis = c.style.display
          c.style.display = 'none'
        }
      },
      getParameters () {
        let condition = {}
        if (!this.visible) {
          return condition
        }
        let advance = this.advance
        let citems = this.conf.items.map(item => {
          let field = item.field
          let value = advance[field]
          if (value) {
            let op = item.op
            return {field, op, value}
          }
          return false
        }).filter(v => v !== false)
        if (citems.length > 0) {
          condition['__xquery'] = JSON.stringify(citems)
        }
        return condition
      }
    }
  }
</script>
<style lang="less">
  .xquery{
    .fac-form{
      background-color: transparent;
      .el-form-item {
        margin-top:6px;
        margin-bottom:6px;
      }
    }
    .query-button{
      margin:0 auto;
      width: 170px;
      padding-top:15px;
      button{
        border: 0px;
        border-radius: 0px;
        min-width: 80px;
      }
    }
  }
</style>
