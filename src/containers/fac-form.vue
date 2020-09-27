<!--
 --可配置表单组件
 --author Paul.Yang E-mail:yaboocn@qq.com
 --version 1.0 2017-8-2
 -->
<template>
  <div class="fac-form-group" >
    <el-form ref="elForm" v-for="(group,$index) in groups" :status-icon="statusIcon" :model="model" :key="$index" class="fac-form" :class="groupCss(group)" :label-width="labelW" label-position="right">
      <div class="title" v-if="group.title">{{group.title}}</div>
      <el-row class="form-body" :gutter="gutterProp">
          <el-col  v-for="(item, $i) in group.items" :key="$i" :span="8" :xs="24" :md="Number(group.elcols)*Number(item.cols)||group.elcols"
                  :lg="Number(group.elcols)*Number(item.cols)||group.elcols">
            <form-item :conf="item" :model="model" :page="page" :fac="fac"/>
          </el-col>
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
    const elcols = 24 / Number(cols) || 12
    if (!state) {
      group.elcols = elcols
      group.col = cols
      return group
    }
    items = items.map((item) => {
      const s = item[state] || item[state.substring(6)]
      s && (item = Object.assign({}, item, s))
      return item
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
      ignore: {
        type: Boolean,
        default: false
      },
      state: String,
      page: Object,
      fac: Object,
      labelWidth: String,
      gutter: Number
    },
    data: function () {
      const labelW = this.conf.labelWidth || this.labelWidth || '120px'
      const gutterProp = this.conf.gutter || this.gutter || 20
      if (isNotNull(this.conf.statusIcon)) {
        this.statusIcon = this.conf.statusIcon && this.statusIcon
      }
      const exist = !(this.ignore === true || this.conf.ignore === true)
      const maxFormCols = 0
      return {
        labelW,
        maxFormCols,
        gutterProp,
        groups: [],
        exist
      }
    },
    watch: {
      conf () {
        this.$mount()
        callHook(this, 'mounted')
      },
      state () {
        this.changeState()
      },
      ignore (v) {
        this.exist = !(v === true || this.conf.ignore === true)
        this.$mount()
        callHook(this, 'mounted')
      }
    },
    mounted () {
      if (this.page && !this.state) {
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
      groupCss (group) {
        return group.css + ' ' + this.state + ' fac-form-width' + this.maxFormCols
      },
      resetFields () {
        this.$refs.elForm.forEach(v => {
          v.resetFields()
        })
      },
      validate (callback) {
        let valid = true
        let count = 0
        const forms = this.$refs.elForm
        const len = forms.length
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
        this.$refs.elForm.forEach(v => {
          v.clearValidate()
        })
      },
      changeState () {
        const vm = this
        const {page, conf, css, exist} = vm
        let pageState = this.state || (page && ('pageState' in page.constructor.prototype) && page.pageState ? page.pageState : 'init')
        pageState = pageState.startsWith('state_') ? pageState : 'state_' + pageState
        if (!exist) {
          vm.groups = []
          return
        }
        let groups = conf.groups || []
        if (groups.length === 0) {
          const group = buildFormGroup(conf, pageState, css)
          vm.maxFormCols = group.cols
          group && groups.push(group)
        } else {
          groups = groups.map(group => buildFormGroup(group, pageState, css)).filter(group => group ? (vm.maxFormCols < group.cols ? !!(vm.maxFormCols = group.cols) || true : true) : false)
        }
        this.groups = groups
      }
    }
  }
</script>
<style lang="less">
  .fac-form-group{
    background: none 0 0 repeat scroll rgb(255, 255, 255);
  }
  .fac-form {
    margin: 0 auto;
    background: none 0 0 repeat scroll rgb(255, 255, 255);
    border-radius: 3px;
    .title {
      border-bottom: 1px dotted rgb(221, 221, 221);
      height: 50px;
      padding-left: 15px;
      line-height: 50px;
      margin-top: 0;
      margin-right: 0;
      text-align: left;
    }
    +.fac-form {
      margin-top: 40px;
    }
    .form-body{
      padding: 30px;
      width: 100%;
      display: table;
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
