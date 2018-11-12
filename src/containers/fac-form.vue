<!--
 --可配置表单组件
 --author Paul.Yang E-mail:yaboocn@qq.com
 --version 1.0 2017-8-2
 -->
<template>
  <div class="fac-form-group">
    <el-form ref="elForm" v-for="group in groups" :status-icon="statusIcon" :model="model" :key="key" class="fac-form" :class="group.css" :label-width="labelW" label-position="right">
      <div class="title" v-if="group.title">{{group.title}}</div>
      <el-row class="form-body" :gutter="gutterProp">
        <template v-for="item in group.items">
          <el-col :span="8" :xs="24" :md="Number(group.elcols)*Number(item.cols)||group.elcols"
                  :lg="Number(group.elcols)*Number(item.cols)||group.elcols">
            <form-item :conf="item" :model="model" :page="page"/>
          </el-col>
        </template>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  import formItem from './form-item.vue'
  import fase from 'fansion-base'

  /**
   * 获取工具方法
   */
  const isNotNull = fase.util.isNotNull
  const callHook = fase.render.callHook

  /**
   * 构建表单分组
   * @param group 分组配置
   * @param state 当前状态
   * @param css 样式名class
   * @returns {*}
   */
  const buildFormGroup = (group, state, css) => {
    if (group.ignore) {
      return
    }
    let {items, cols = 2, title} = group
    if (!items || items.length === 0) {
      return
    }
    let elcols = 24 / Number(cols) || 12
    if (!state) {
      group.elcols = elcols
      group.col = cols
      return group
    }
    items = items.map((item) => {
      if (item[state]) {
        item = Object.assign({}, item, item[state])
      }
      return {...item}
    }).filter(item => !item.ignore)
    if (items.length === 0) {
      return
    }

    css = css ? css + ' fac-form-cols' + group.cols : 'fac-form-cols' + group.cols
    return {
      title,
      cols,
      elcols,
      items,
      css
    }
  }
  export default {
    name: 'FacForm',
    props: {
      css: String,
      conf: Object,
      model: Object,
      statusIcon: {
        type: Boolean,
        default: true
      },
      page: Object,
      labelWidth: String,
      gutter: Number
    },
    data: function () {
      let labelW = this.conf.labelWidth || this.labelWidth || '120px'
      let gutterProp = this.conf.gutter || this.gutter || 20
      if (isNotNull(this.conf.statusIcon)) {
        this.statusIcon = this.conf.statusIcon && this.statusIcon
      }
      return {
        key: Symbol('itemkey'),
        labelW,
        gutterProp,
        groups: []
      }
    },
    watch: {
      conf () {
        this.$mount()
        callHook(this, 'mounted')
      }
    },
    mounted () {
      if (this.page) {
        this.page.$on('stateChanged', this.changeState)
      }
      this.changeState()
    },
    destroy () {
      if (this.page) {
        this.page.$off('stateChanged', this.changeState)
      }
    },
    components: {
      formItem
    },
    methods: {
      resetFields () {
        this.$refs['elForm'].forEach(v => {
          v.resetFields()
        })
      },
      validate (callback) {
        let valid = true
        let count = 0
        let forms = this.$refs['elForm']
        let len = forms.length
        forms.forEach(v => {
          v.validate(c => {
            if (!c) {
              valid = false
            }
            count++
            if (count === len) {
              callback(valid)
            }
          })
        })
      },
      clearValidate () {
        this.$refs['elForm'].forEach(v => {
          v.clearValidate()
        })
      },
      changeState () {
        let {page, conf, css} = this
        let pageState = page && 'pageState' in page ? page.pageState : 'init'
        let groups = conf.groups || []
        if (groups.length === 0) {
          let group = buildFormGroup(conf, pageState, css)
          group && groups.push(group)
        } else {
          groups = groups.map(group => buildFormGroup(group, pageState, css)).filter(group => !group)
        }
        this.groups = groups
      }
    }
  }
</script>
<style lang="less">
  .fac-form {
    background: none 0px 0px repeat scroll rgb(255, 255, 255);
    border-radius: 3px;
    .title {
      border-bottom: 1px dotted rgb(221, 221, 221);
      height: 50px;
      padding-left: 15px;
      line-height: 50px;
      margin-top: 0px;
      margin-right: 0px;
      text-align: left;
    }
    +.fac-form {
      margin-top: 40px;
    }
    .form-body{
      padding: 30px;
    }
    .el-form-item {
      margin-bottom: 26px;
    }
    .el-autocomplete,.el-select{
      display: block;
    }
  }
  .fac-form-cols2{
    .form-body{
      padding-left:60px;
      padding-right:60px;
    }
    .el-col {
      padding-left: 50px!important;
      padding-right: 50px!important;
    }
  }
  .fac-form-cols1{
    .form-body{
      padding-left:150px;
      padding-right:150px;
    }
    .el-col {
      padding-left: 30px!important;
      padding-right: 30px!important;
    }
  }
</style>
