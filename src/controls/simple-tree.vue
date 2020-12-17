<template>
<el-tree v-on="$listeners" :data="model" v-bind="[$props, $attrs]" :load="loadNode" ref="tree">
  <slot slot-scope="{ node }" v-if="icon === null"/>
  <span class="custom-tree-node" slot-scope="{ node }"  v-if="icon !== null"><i :class="icon"/><span>{{ node.label }}</span></span>
</el-tree>
</template>

<script>
import fase from 'fansion-base'

const {gson, furl} = fase.rest
export default {
  name: 'simple-tree',
  props: {
    url: {
      type: String,
      required: true
    },
    lazy: Boolean,
    label: {
      type: String,
      defaultValue: 'label'
    },
    icon: String,
    search: String,
    rootName: String,
    children: {
      type: String,
      defaultValue: 'children'
    },
    isLeaf: {
      type: String,
      defaultValue: 'leaf'
    },
    keyword: {
      type: String,
      defaultValue: 'keyword'
    }
  },
  data () {
    const model = []
    const root = this.rootName ? {id: 'root'} : null
    if (root) {
      root[this.label] = this.rootName
      model.push(root)
    }
    return {
      root,
      model
    }
  },
  methods: {
    /**
     * 初始化数据
     */
    refresh () {
      const vm = this
      const param = {id: 'root'}
      gson(furl(vm.url, param), param, res => vm.root ? (vm.root.children = res) : (vm.model = res))
    },
    /**
     * 懒加载时加载节点数据
     * @param node 上级节点
     * @param resolve 注入数据
     */
    loadNode (node, resolve) {
      const params = {id: node.id}
      gson(furl(this.url, params), params, resolve)
    },
    /**
     * 从后台查询数据
     * @param value 关键字
     */
    searchData (keyword) {
      const vm = this
      if (!keyword) {
        vm.refresh()
      } else {
        const url = vm.search || vm.url
        const params = {}
        params[vm.keyword] = keyword
        gson(furl(url, params), params, res => vm.root ? (vm.root.children = res) : (vm.model = res))
      }
    },
    /**
     * 过滤节点
     * @param value 关键字
     */
    filter (value) {
      const vm = this
      vm.lazy ? vm.searchData(value) : vm.$refs.tree.filter(value)
    }
  }
}
</script>
