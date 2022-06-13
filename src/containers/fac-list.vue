<template>
  <ul class="fac-list">
    <slot name="header"/>
    <li class="empty" v-if="!data|| data.length===0">
      <div class="empty-block" ><span class="no-data" >暂无数据</span></div>
    </li>
    <draggable :list="data" ghost-class="ghost" draggable=".list-item" handle=".node-drag" @start="dragging = true"
               @end="dragging = false"  v-if="data&&data.length>1">
      <li v-for="(item, index) in data" :key="item.id||item[labelField]" class="list-item" >
        <el-checkbox v-if="showCheckbox" v-model="item[checkedField]" :disabled="!!item.disabled"/>
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
/**
 * 排序方法
 * @param field 排序字段
 * @returns {number} 比较结果
 */
const sortFunc = (field) => (a, b) => {
  const aa = a[field]
  const bb = b[field]
  if (aa === bb) {
    return 0
  }
  return aa && bb ? (a > b ? 1 : -1) : !aa && !bb ? 0 : (!aa ? -1 : 1)
}
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
    checked: {
      type: String,
      default: 'checked'
    },
    sortable: {
      type: Boolean,
      default: false
    },
    sort: {
      type: String,
      default: 'sorting'
    },
    showCheckbox: {
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
    const checkedField = c.checked || this.checked
    const sortFlag = typeof c.sortable === 'boolean' ? c.sortable : this.sortable
    const sortField = c.sort || this.sort
    const sorter = sortFlag && sortField ? sortFunc(sortField) : null
    const data = this.sortFlag && sortField && this.model ? this.model.sort(sorter) : this.model || []
    return {
      labelField,
      checkedField,
      sortFlag,
      sortField,
      sorter,
      data,
      dragIndex: '',
      enterIndex: '',
      dragging: false
    }
  },
  computed: {
    dragable () {
      return this.sortFlag && Array.isArray(this.data) && this.data.length > 1
    }
  },
  methods: {
    dragstart (index) {
      this.dragIndex = index
    },
    dragenter (e, index) {
      e.preventDefault()
      if (this.dragIndex !== index) {
        const moving = this.data[this.dragIndex]
        this.data.splice(this.dragIndex, 1)
        this.data.splice(index, 0, moving)
        this.dragIndex = index
      }
    },
    dragover (e, index) {
      e.preventDefault()
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
