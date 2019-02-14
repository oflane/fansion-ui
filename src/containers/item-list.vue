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
    <div class="item-list-empty-block" v-if="!model||model.length==0"><span class="no-data" >暂无数据</span></div>
    <ul v-else>
      <li :class="getItemClass(item, $index)" v-for="(item,$index) in model" @click="onClickItem(item,$index)">
        <img :src="item[image]" class="image" v-if="image != null">
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
        let isActrive = this.key ? item[this.key] === this.current : this.current === $index
        return isActrive && 'active'
      },
      onClickItem (item, $index) {
        this.current = this.key ? item[this.key] : $index
        this.$emit('change', item, $index)
      },
      getCurrent () {
        let vm = this
        let {key, model, current} = vm
        if (!current) {
          return
        }
        return key ? model.find(v => v[key] === current) : current < 0 || current >= model.length ? null : model[current]
      },
      setCurrent (current) {
        let vm = this
        let {key, model} = vm
        let item = key ? model.find(v => v[key] === current) : current < 0 || current >= model.length ? null : model[current]
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
  .item-list-empty-block{
    position: relative;
    min-height: 60px;
    text-align: center;
    width: 100%;
    height: 100%;

    .no-data{
      position: absolute;
      left: 50%;
      top: 50%;
      -ms-transform: translate(-50%,-50%);
      transform: translate(-50%,-50%);
      color: #5e7382;
    }
  }
</style>
