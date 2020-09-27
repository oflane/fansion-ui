<template>
  <!-- -->
</template>
<script>
  import fase from 'fansion-base'

  /**
   * 引入数据加载类
   * @type {DataLoader}
   */
  const DataLoader = fase.DataLoader
  /**
   * table排序
   * @author Paul.Yang E-mail:yaboocn@qq.com
   * @version 1.0 2017-8-25
   */
  export default {
    name: 'FacTableSort',
    props: {
      loader: DataLoader,
      defaultSort: Object
    },
    data () {
      this.loader.addPlugin(this)
      const sort = this.defaultSort || {}
      return {
        sort
      }
    },
    methods: {
      /**
       * 排序事件处理方法，出发dataloader加载
       * @param prop
       * @param order
       */
      setSort ({prop, order}) {
        prop || order ? this.sort = {sidx: prop, sord: order} : this.sort = null
        this.loader.load()
      },
      /**
       * 实现dataloader获取参数的借口
       * @returns {ObjectConstructor | * | {}}
       */
      getParameters () {
        return this.sort
      }
    }
  }
</script>
