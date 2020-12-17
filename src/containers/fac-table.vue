<!--
 --可配置表格组件
 --author Paul.Yang E-mail:yaboocn@qq.com
 --version 1.0 2017-8-2
 -->
<script>
import simpleTable from './simple-table'
import fase from 'fansion-base'
import tableSort from './table-sort'

/**
 * 获取工具方法
 */
const {defaultTable, buildColumn} = simpleTable
const {toRender, toProps, callHook} = fase.render
/**
 * 数据加载器
 * @type {DataLoader}
 */
const DataLoader = fase.DataLoader

export default {
  name: 'FacTable',
  template: '<div/>',
  props: {
    conf: Object,
    columns: Array,
    model: Array,
    page: Object,
    fac: Object,
    selection: {
      type: Number,
      default: -1
    },
    loader: DataLoader
  },
  watch: {
    conf () {
      this.$mount()
      callHook(this, 'mounted')
    }
  },
  beforeMount () {
    let options = Object.assign({}, defaultTable, this.conf)
    let tableProps = toProps(options, ['columns', ':model', 'pos', 'conf', 'type', 'selection', 'ref'])
    let components = {
      tableSort
    }
    let cols = this.columns || this.conf.columns || []
    if ((this.selection * 1 === -1 && options.selection) || this.selection * 1 === 1) {
      cols = [{selection: true, align: 'center'}, ...cols]
    }
    let columnTemplate = buildColumn(cols, components)
    if (this.loader) {
      columnTemplate += '<table-sort ref="tableSort" :loader="loader"/>'
    }
    let sortMethod = ''
    if (this.loader && !options['@sort-change'] && !options['@sortChange']) {
      sortMethod = '@sort-change="$refs[\'tableSort\'].setSort(...arguments)"'
    }
    toRender(this, `<el-table ref="realTable" ${sortMethod} :data="model" ${tableProps}>${columnTemplate}</el-table>`, components)
    console.log(this)
  },
  methods: {
    getTable () {
      return this.$refs.realTable
    }
  }
}
</script>
