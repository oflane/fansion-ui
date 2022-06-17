<!--
 --简单搜索组件
 --author Paul.Yang E-mail:yaboocn@qq.com
 --version 1.0 2017-8-24
 -->
<template>
  <div :class="xclass">
    <el-input
      v-model="quickValue"
      :disabled.sync="disabled"
      clearable
      @keydown.enter.stop.native="handleSearch"
      @clear="handleSearch"
      v-bind="[$props, $attrs]"
    >
      <i class="el-input__icon el-icon-search" @click="handleSearch" slot="suffix"/>
    </el-input>
    <a class="advance-switch" href="javascript:void(0)" @click="changeMode" v-html="advanceText" v-show="hasAdvance"></a>
  </div>
</template>
<script>
  import fase from 'fansion-base'

  /**
   * 引入数据加载类
   * @type {DataLoader}
   */
  const DataLoader = fase.DataLoader
  /**
   * 引入工具方法
   */
  const filterProps = fase.util.filterProps
  /**
   * 简单搜索组件
   * @author Paul.Yang E-mail:yaboocn@qq.com
   * @version 1.0 2018-1-22
   */
  export default {
    name: 'FacSearch',
    props: {
      conf: Object,
      loader: DataLoader,
      page: Object,
      fac: Object,
      css: String,
      advance: String,
      disabled: Boolean,
      value: String,
      free: Boolean
    },
    data () {
      const c = this.conf || {}
      const props = filterProps(c, ['conf', 'items', 'pos', 'xclass', '@search', 'type'])
      if (this.loader) {
        this.loader.addPlugin(this)
      }
      let xclass = c.xclass ? 'xsearch ' + c.xclass : 'xsearch'
      this.css && (xclass += ' ' + this.css)
      const advCtrl = c.advance || this.advance
      let isFree = true
      if (c.free === false) {
        isFree = false
      } else if (c.free !== true && this.free === false) {
        isFree = false
      }
      const quickValue = this.value
      return {
        quickValue,
        xclass,
        props,
        advCtrl,
        isFree,
        advanceText: '高级<i class="fa fa-chevron-down"></i>',
        hasAdvance: false,
        advanceMode: false
      }
    },
    watch: {

    },
    mounted () {
      if (this.advCtrl) {
        this.advanceQuery = this.$vnode.context.$refs[this.advCtrl]
        if (this.xclass.indexOf(' with-advance') < 0) {
          this.xclass = this.xclass + ' with-advance'
        }
        this.hasAdvance = true
        this.advanceQuery.setVisible(false)
      }
    },
    methods: {
      handleSearch () {
        if (this.disabled) {
          return
        }
        if (this.loader) {
          this.loader.load(true)
        }
        this.$emit('search', this.quickValue, this)
        this.$emit('input', this.quickValue, this)
      },
      changeMode () {
        this.advanceMode = !this.advanceMode
        if (this.advanceQuery) {
          this.advanceQuery.setVisible(this.advanceMode)
        }
        this.advanceText = this.advanceMode ? '收起<i class="fa fa-chevron-down"></i>' : '高级<i class="fa fa-chevron-down"></i>'
      },
      getValue () {
        return this.quickValue
      },
      reset () {
        this.quickValue = null
        this.$emit('input', this.quickValue, this)
        this.handleSearch()
      },
      loadReset () {
      },
      getParameters () {
        const condition = {}
        const qitems = this.conf.items
        const qvalue = this.quickValue
        if (this.quickValue && qitems) {
          if (this.isFree) {
            condition._freeCon = Array.isArray(qitems) ? qitems.join(',') : qitems
            condition._freeConVal = qvalue
          } else if (Array.isArray(qitems)) {
            qitems.forEach((v) => {
              condition[v] = qvalue
            })
          } else {
            condition[qitems] = qvalue
          }
        }
        return condition
      }
    }
  }
</script>
<style lang="less">
  .xsearch {
    width: 300px;
    position: relative;
    &.with-advance{
      margin-right: 60px;
    }
    .el-icon-search:hover{
      color:#000;
      cursor: pointer;
    }
  }

  .advance-switch{
    position: absolute;
    right: -60px;
    top:10px;
    i{
      margin-left: 4px;
    }
  }
</style>
