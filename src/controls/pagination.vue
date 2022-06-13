<!--
 --可配置分页
 --author Paul.Yang E-mail:yaboocn@qq.com
 --version 1.0 2017-8-24
 -->
<template>
  <el-pagination
    @size-change="sizeChange"
    @current-change="currentChange"
    :current-page.sync="currentPage"
    :page-sizes="pss"
    :page-size.sync="ps"
    :layout="ly"
    background
    :total="model.totalElements">
  </el-pagination>
</template>
<script>
import fase from 'fansion-base'

/**
 * 引入数据加载类
 * @type {DataLoader}
 */
const DataLoader = fase.DataLoader

/**
 * 可配置分页组件
 * @author Paul.Yang E-mail:yaboocn@qq.com
 * @version 1.0 2018-1-22
 */
export default {
  name: 'FacPagination',
  props: {
    conf: Object,
    loader: DataLoader,
    model: Object,
    page: Object,
    fac: Object,
    current: {
      type: Number,
      default: 1
    },
    pageSize: Number,
    pageSizes: Array,
    layout: String
  },
  data () {
    const c = this.conf || {}
    const ps = c.pageSize || this.pageSize || 20
    const pss = this.pageSizes || [20, 50, 100, 400]
    const ly = c.layout || this.layout || 'total, sizes, prev, pager, next, jumper'
    this.loader && this.loader.addPlugin && this.loader.addPlugin(this)

    return {
      ps,
      pss,
      ly,
      currentPage: this.current
    }
  },
  watch: {
    conf (val) {
      if (val.pageSize) {
        this.ps = val.pageSize
      }
      if (val.pageSizes) {
        this.pss = val.pageSizes
      }
      if (val.layout) {
        this.ly = val.layout
      }
    }
  },
  methods: {
    sizeChange () {
      this.currentPage = 1
      if (this.loader) {
        this.loader.load()
      }
      this.$emit('size-change', this, ...arguments)
    },
    currentChange () {
      if (this.loading) {
        this.loading = undefined
        delete this.loading
        return
      }
      if (this.loader) {
        this.loader.load()
      }
      this.$emit('current-change', this, ...arguments)
    },
    getParameters () {
      return {_pageNo: this.currentPage, _pageSize: this.ps}
    },
    reset () {
      this.loading = true
      this.currentPage = 1
    }
  }
}
</script>
