<!--
  - Copyright(c) Oflane Software 2017. All Rights Reserved.
  -->

<!--
 --条目列表
 --author Paul.Yang E-mail:yaboocn@qq.com
 --version 1.0 2017-8-2
 -->
<template>
  <div class="fac-item-list">
    <div class="item-list-empty-block" v-if="!model||model.length===0"><span class="no-data" >暂无数据</span></div>
    <ul v-else>
      <li :class="getItemClass(item, $index)" v-for="(item,$index) in model" @click="onClickItem(item,$index)" :key="$index">
        <img :src="item[image]" class="image" v-if="image != null" alt="图片">
        <span></span>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
  name: 'FacItemList',
  props: {
    page: Object,
    fac: Object,
    model: Array,
    current: [String, Number],
    label: {
      type: String,
      default: 'label'
    },
    image: String,
    key: String,
    noDefault: Boolean
  },
  data () {
    let {key, model, current, noDefault} = this
    if (key) {
      if (current && !model.find(v => v[key] === current)) {
        this.current = noDefault ? null : model[0][key]
      }
    } else if (typeof current * 1 === 'number') {
      current = current * 1
      if (current < 0 || current >= model.length) {
        this.current = noDefault ? null : 0
      }
    }
    return {
    }
  },
  watch: {
    current (value) {
      this.setCurrent(value)
    }
  },
  methods: {
    getItemClass (item, $index) {
      if (!this.current) {
        return
      }
      const isActive = this.key ? item[this.key] === this.current : this.current === $index
      return isActive && 'active'
    },
    onClickItem (item, $index) {
      this.current = this.key ? item[this.key] : $index
      this.$emit('change', item, $index)
    },
    getCurrent () {
      const vm = this
      const {key, model, current} = vm
      if (!current) {
        return
      }
      return key ? model.find(v => v[key] === current) : current < 0 || current >= model.length ? null : model[current]
    },
    setCurrent (current) {
      const vm = this
      const {key, model} = vm
      const item = key ? model.find(v => v[key] === current) : current < 0 || current >= model.length ? null : model[current]
      if (item) {
        vm.current = current
        vm.$emit('change', item)
      }
    }
  }
}
</script>

<style lang="less">
  .fac-item-list{
    border: 1px solid #666666;
    li {
      padding:10px 15px;
      +li{
        border-top: 1px solid #666666;
      }
      &.active{
        padding:10px 15px 10px 12px;
        border-left: 3px solid #0377c1;
      }
    }
  }

</style>
