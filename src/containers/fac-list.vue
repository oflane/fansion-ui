<template>
  <ul class="fac-list">
    <slot name="header"/>
    <li class="empty" v-if="!model|| model.length===0">
      <div class="empty-block" ><span class="no-data" >暂无数据</span></div>
    </li>
    <draggable :list="model" ghost-class="ghost" draggable=".list-item" handle=".node-drag" @start="dragstart" :move="dragover"
               @end="dragenter"  v-if="model && model.length > 0">
      <li v-for="(item, index) in model" :key="item.id||item[labelField]" class="list-item" >
        <slot :data="(item, index)">
          <span>{{item[labelField]}}</span>
        </slot>
        <span class="node-drag" v-if="dragable">
          <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-icon="DragOutlined"><path d="M8.25 6.5a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5Zm0 7.25a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5Zm1.75 5.5a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0ZM14.753 6.5a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5ZM16.5 12a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0Zm-1.747 9a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5Z" fill="currentColor"></path></svg>
        </span>
      </li>
    </draggable>
    <slot name="footer"/>
  </ul>
</template>
<script >
import draggable from 'vuedraggable'

export default {
  name: 'FacList',
  props: {
    page: Object,
    fac: Object,
    model: Array,
    conf: Object,
    label: {
      default: 'label'
    },
    sortable: {
      type: Boolean,
      default: false
    }
  },
  components: {
    draggable
  },
  data () {
    const c = this.conf || {}
    const labelField = c.label || this.label
    const sortFlag = typeof c.sortable === 'boolean' ? c.sortable : this.sortable
    return {
      labelField,
      sortFlag
    }
  },
  computed: {
    dragable () {
      return this.sortFlag && Array.isArray(this.model) && this.model.length > 1
    }
  },
  methods: {
    dragstart (e) {
      this.$emit('dragstart', e)
    },
    dragenter (e) {
      this.$emit('dragend', e)
    },
    dragover (e) {
      this.$emit('dragover', e)
    }
  }
}
</script>
<style lang="less">
  .fac-list{
    font-size: 14px;
    color: #5e6d82;
    list-style: none;
    padding: 0;
    border: 1px solid #dee0e3;
    border-radius: 4px;
    //.fac-list-drag-move {
    //  transition: transform .5s;
    //}
    .list-item:nth-last-child(n + 2) {
      border-bottom: 1px solid #d9d9d9;
    }
    li.list-item {
      display: flex;
      padding: 10px 15px;
      align-items: center;
      .node-drag{
        margin-left: auto;
        font-size: 20px;
        line-height: 0;
        display: flex;
        align-items: center;
        height: 24px;
      }
    }
  }
  .ghost {
    opacity: 0.5;
    background: #c8ebfb;
  }
</style>
