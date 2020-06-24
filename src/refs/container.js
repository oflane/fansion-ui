/**
 * 参照的对话框容器
 * author Paul.Yang E-mail:yaboocn@qq.com
 * version 1.0 2017-8-16
 */
import fase from 'fansion-base'

/**
 * 引入工具方法
 */
const toProps = fase.render.toProps

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
    const title = this.title
    const options = this.$options
    if (this.component) {
      if (!('components' in options)) {
        options.components = Object.create(options.components)
      }
      Object.assign(options.components, {'ref-content': this.component})
      const cprops = toProps(this.params)
      refContent = `<ref-content ref="content" ${cprops}/>`
    }
    if (this.html) {
      refContent += this.html
    }
    if (this.text) {
      refContent += this.text
    }
    const dprops = toProps(this.dialogProps)
    options.template = `<el-dialog ${dprops} :visible.sync="visible" title="${title}">${refContent}
<div slot="footer">
    <el-button type="primary" @click="onOk">确定</el-button>
    <el-button @click="onCancel">取消</el-button>
    <el-button @click="onClear">清除</el-button>
</div>
</el-dialog>`
  },
  mounted () {
    this.$emit('open', this.$refs.content)
  },
  methods: {
    show () {
      this.visible = true
      this.$emit('open', this.$refs.content)
    },
    isVisible () {
      return this.visible
    },
    hide () {
      this.visible = false
      this.$emit('close', this.$refs.content)
    },
    onOk () {
      const ref = this.$refs.content
      if (ref && typeof ref.getData === 'function') {
        const row = ref.getData()
        if (row) {
          this.$closeReference(row)
        }
      } else {
        const el = this.$el.querySelector('[selected]')
        if (el) {
          let data = el.getAttribute('data')
          if (data) {
            // eslint-disable-next-line no-eval
            data = eval(data)
            this.$closeReference(data)
          } else {
            const value = el.getAttribute('value')
            const l = el.getAttribute('label')
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
