<!--
 --分片控件
 --author Paul.Yang E-mail:yaboocn@qq.com
 --version 1.0 2017-8-24
 -->
<template>
  <transition name="el-fade-in-linear" >
    <div class="slice-block-control" v-show="show">
      <div v-if="!last&&!loading" @click="currentChange">
        <i class="el-icon-caret-bottom"></i><span class="hover-label">显示更多</span>
      </div>
      <div v-if="loading">
        <i class="el-icon-loading"></i><span class="hover-label">加载中...</span>
      </div>
      <div  v-if="complete">
        <i class="el-icon-caret-top"></i><span class="hover-label">已全部加载</span>
      </div>
    </div>
  </transition>
</template>
<script>
  import fase from 'fansion-base'

  /**
   * 引入数据加载类
   * @type {DataLoader}
   */
  const DataLoader = fase.DataLoader

  /**
   * 数据分片组件
   * @author Paul.Yang E-mail:yaboocn@qq.com
   * @version 1.0 2018-1-22
   */
  export default {
    name: 'Slice',
    props: {
      conf: Object,
      loader: DataLoader,
      model: [Object, Boolean],
      page: Object,
      fac: Object,
      autoHide: {
        type: Boolean,
        default: false
      },
      pageSize: Number
    },
    data () {
      const c = this.conf || {}
      const ps = c.pageSize || this.pageSize || 20
      this.loader.addPlugin(this)
      const last = this.model && typeof this.model === 'object' ? this.model.last : !!this.model
      return {
        last,
        ps,
        currentPage: 1,
        show: true
      }
    },
    computed: {
      complete () {
        return !this.loading && this.last
      }
    },
    watch: {
      conf (val) {
        if (val.pageSize) {
          this.ps = val.pageSize
        }
      },
      model (val) {
        this.last = val && typeof val === 'object' ? val.last : !!val
        if (this.loading) {
          this.loading = undefined
          delete this.loading
        }
      },
      complete (v) {
        if (v && this.autoHide) {
          const vm = this
          setTimeout(_ => (vm.show = false), 2000)
        }
      }
    },
    methods: {
      sizeChange () {
        if (this.loader) {
          this.loader.load()
        }
        this.$emit('size-change', this, ...arguments)
      },
      currentChange () {
        this.currentPage = this.currentPage + 1
        if (this.loader) {
          this.loading = true
          this.loader.load()
        }
        this.$emit('current-change', this, ...arguments)
      },
      getParameters () {
        return {_pageNo: this.currentPage, _pageSize: this.ps}
      },
      refreshData (data) {
        this.last = data.last
        if (this.loading) {
          this.loading = undefined
          delete this.loading
        }
      },
      reset () {
        this.loading = true
        this.currentPage = 1
      }
    }
  }
</script>
<style lang="less" scoped>
.slice-block-control{
  border-top: 1px solid #eaeefb;
  height: 44px;
  box-sizing: border-box;
  background-color: #fff;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  text-align: center;
  margin-top: -1px;
  color: #d3dce6;
  cursor: pointer;
  position: relative;
  i {
    transform:translateX(-40px);
    font-size: 16px;
    line-height: 44px;
    transition: .3s;
  }
  .hover-label{
    transform: translateX(-30px);
    display: inline-block;
    position: absolute;
    font-size: 14px;
    line-height: 44px;
    transition: .3s;
  }
  &:hover{
    color: #409eff;
    background-color: #f9fafc;
    .hover-label{
      color: #409eff;
    }
    i {
      color: #409eff;
    }
  }
  >div {
    height: 100%;
  }
}
</style>
