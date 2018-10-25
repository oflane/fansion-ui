<!--
 --可配置表单项目
 --author Paul.Yang E-mail:yaboocn@qq.com
 --version 1.0 2017-8-2
 -->
<script>
  import fac from 'fansion-fac'
  import fase from 'fansion-base'

  /**
   * 获取工具方法
   */
  const {toRender, callHook} = fase.render
  const component = fac.comps.component

  export default {
    template: '<div></div>',
    props: {
      conf: Object,
      page: Object,
      model: {}
    },
    data: function () {
      return {
        validation: null
      }
    },
    watch: {
      conf () {
        this.$mount()
        callHook(this, 'mounted')
      }
    },
    components: {},
    beforeMount: function () {
      let conf = this.conf
      let validation = this.conf.validation
      validation = validation && (!Array.isArray(validation) ? validation.ignore ? null : validation : validation.filter(v => !v.ignore).map(v => {
        if (typeof v.method === 'string') {
          v = {...v}
          v.method = this.page && this.page[v.m]
          return v
        }
        return v
      }))
      this.validation = validation
      let {components, template} = component(conf)
      console.log(template)
      toRender(this, `<el-form-item :prop="conf.field" :label="conf.label" :rules="validation">${template}</el-form-item>`, components)
    }
  }
</script>
<style lang="less">
  .el-form-item .el-switch{
    margin-top:12px;
  }
</style>
