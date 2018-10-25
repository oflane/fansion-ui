/**
 * 参照的对话框容器
 * author Paul.Yang E-mail:yaboocn@qq.com
 * version 1.0 2017-8-16
 */
import fase from 'fansion-base'

/**
 * 引入工具方法
 */
let toProps = fase.render.toProps

/**
 * 默认的参照容器
 * @author Paul.Yang E-mail:yaboocn@qq.com
 * @version 1.0 2010/19/18
 */
export default {
  name: 'RefContainer',
  props: {
    component: [Object, Function],
    text: String,
    html: String,
    dialogProps: Object,
    params: Object,
    title: String
  },
  data () {
    return {visible: true}
  },
  created () {
    let refContent = ''
    let title = this.title
    let options = this.$options
    if (this.component) {
      if (!options.hasOwnProperty('components')) {
        options.components = Object.create(options.components)
      }
      Object.assign(options.components, {'ref-content': this.component})
      let cprops = toProps(this.params)
      refContent = `<ref-content ref="content" ${cprops}/>`
    }
    if (this.html) {
      refContent += this.html
    }
    if (this.text) {
      refContent += this.text
    }
    let dprops = toProps(this.dialogProps)
    options.template = `<el-dialog ${dprops} :visible.sync="visible" title="${title}">${refContent}
<div slot="footer">
    <el-button type="primary" @click="onOk">确定</el-button>
    <el-button @click="onCancel">取消</el-button>
    <el-button @click="onClear">清除</el-button>
</div>
</el-dialog>`
  },
  methods: {
    show () {
      this.visible = true
    },
    isVisible () {
      return this.visible
    },
    hide () {
      this.visible = false
    },
    onOk () {
      let ref = this.$refs.content
      if (ref && typeof ref.getData === 'function') {
        let row = ref.getData()
        if (row) {
          this.$closeReference(row)
        }
      } else {
        let el = this.$el.querySelector('[selected]')
        if (el) {
          let data = el.getAttribute('data')
          if (data) {
            // eslint-disable-next-line no-eval
            data = eval(data)
            this.$closeReference(data)
          } else {
            let value = el.getAttribute('value')
            let l = el.getAttribute('label')
            this.$closeReference({value, label: l || el.innerText})
          }
        }
      }
    },
    onCancel () {
      this.$closeReference()
    },
    onClear () {
      this.$closeReference({})
    }
  }
}
