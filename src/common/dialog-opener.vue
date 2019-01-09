<!--
  - Copyright(c) Oflane Software 2017. All Rights Reserved.
  -->

<!--
 --对话框容器
 --author Paul.Yang E-mail:yaboocn@qq.com
 --version 1.0 2017-7-20
 -->
<template>
  <!-- -->
</template>
<script>
  import fase from 'fansion-base'

  /**
   * 获取工具方法
   */
  const {toRender, toProps} = fase.render
  const getText = fase.rest.getText

  export default {
    name: 'dialogOpener',
    props: {
      component: [Object, Function],
      text: String,
      html: String,
      dialogProps: Object,
      params: Object,
      dialog: Boolean,
      title: String
    },
    data () {
      let loadText = ''
      if (this.text) {
        getText(this.text).then(t => { loadText = t })
      }
      let hasFrame = this.dialog || this.component.dialog
      return {loadText, visible: true, hasFrame}
    },
    created () {
      let title = this.title ? ' title="' + this.title + '"' : ''
      if (this.component) {
        let components = {'dialog-content': this.component}
        let prop = toProps(this.params, null, null, 'params')
        if (this.hasFrame) {
          toRender(this, `<dialog-content ${prop} ref="content"${title} >{{loadText}}{{html}}</dialog-content>`, components)
        } else {
          let dprops = toProps(this.dialogProps)
          toRender(this, `<el-dialog ${dprops} :visible.sync="visible"${title}><dialog-content ${prop}>{{loadText}}{{html}}</dialog-content></el-dialog>`, components)
        }
      } else {
        let dprops = toProps(this.dialogProps)
        toRender(this, `<el-dialog ${dprops} :visible.sync="visible"${title}>{{loadText}}{{html}}</el-dialog>`)
      }
    },
    methods: {
      show () {
        if (this.hasFrame) {
          this.$refs['content'].show()
        }
        this.visible = true
      },
      isVisible () {
        if (this.hasFrame && this.$children.length > 0) {
          return this.$children[0].isVisible()
        }
        return this.visible
      },
      hide () {
        if (this.hasFrame) {
          this.$refs['content'].hide()
        }
        this.visible = false
      }
    }
  }
</script>
