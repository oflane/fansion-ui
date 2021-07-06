<template>
  <div class="fac-box-list" v-bind="[$props, $attrs]">
    <div class="empty-block" v-if="!model|| model.length===0"><span class="no-data" >暂无数据</span></div>
    <ul v-else class="clearfix">
      <li :class="cellClass($index)" @click="click($event, item, $index)" @dblclick="dblclick($event, item, $index)" v-for="(item, $index) in model" :key="'item'+$index">
        <slot :data="(item, $index)">
          <i v-if="hasIcon()" :class="iconClass(item)"></i>
          <el-image v-if="hasImage()"
            style="width: 100%; height: 100px"
            :src="imageSrc(item)" :preview-src-list="preview(item)"
            fit="scale-down">
            <div slot="error" style="height: 100%;">
              <div class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </div>
          </el-image>
          <label class="label" :title="item[label]">{{item[label]}}</label>
        </slot>
      </li>
    </ul>
  </div>
</template>
<script>
import fase from 'fansion-base'

const isNotBlank = fase.util.isNotBlank
const computeIndex = ({valueProp, model, value, noDefault}) => {
  if (model == null || model.length === 0) {
    return -1
  }
  if (valueProp) {
    const i = model.findIndex(v => v[valueProp] === value)
    if (i >= 0) {
      return i
    }
    return noDefault ? -1 : 0
  } else if (typeof value === 'number') {
    const i = value
    if (i < 0 || i >= model.length) {
      return noDefault ? -1 : 0
    }
  }
}
export default {
  name: 'FacBoxList',
  props: {
    page: Object,
    fac: Object,
    model: Array,
    value: [String, Number],
    label: {
      type: String,
      default: 'label'
    },
    cols: {
      type: Number,
      default: 5
    },
    selectDisable: {
      type: Boolean,
      default: false
    },
    previewImage: String,
    image: String,
    icon: String,
    staticIcon: {
      type: Boolean,
      default: false
    },
    valueProp: String,
    noDefault: {
      type: Boolean,
      default: true
    },
    fixed: Boolean
  },
  data () {
    const currentIndex = computeIndex(this)
    return {
      currentIndex
    }
  },
  watch: {
    model () {
      this.currentIndex = computeIndex(this)
    },
    value () {
      this.currentIndex = computeIndex(this)
    },
    currentIndex (val, old) {
      const k = this.valueProp
      const o = val === -1 ? null : old >= 0 ? (k ? this.model[old][k] : old) : k ? null : old
      const r = this.currentIndex >= 0 ? (k ? this.model[this.currentIndex][k] : this.currentIndex) : k ? null : this.currentIndex
      this.$emit('input', r)
      this.$emit('change', r, o)
    }
  },
  methods: {
    hasIcon () {
      return !this.hasImage() && isNotBlank(this.icon)
    },
    hasImage () {
      return isNotBlank(this.image)
    },
    cellClass (index) {
      const cols = this.fixed && parseInt(this.model.length / this.cols) === 0 ? this.model.length : this.cols
      const last = (index + 1) % this.cols === 0 ? ' last' : ''
      return 'col' + cols + last + (this.currentIndex === index && !this.selectDisable ? ' selected' : '') + (this.image ? '' : ' only-label')
    },
    iconClass (item) {
      const c = this.staticIcon ? this.icon : item[this.icon]
      return c || 'el-icon-picture-outline'
    },
    imageSrc (item) {
      return this.staticIcon ? this.image : item[this.image]
    },
    preview (item) {
      return this.previewImage ? item[this.previewImage] || item[this.image] : item[this.image]
    },
    getCurrentItem () {
      return this.currentIndex !== -1 ? this.model[this.currentIndex] : null
    },
    getCurrentIndex () {
      return this.currentIndex
    },
    click (e, item, index) {
      this.currentIndex = index
      this.$emit('click', item, index, e)
    },
    dblclick (e, item, index) {
      this.$emit('dblclick', item, index, e)
    },
    reset () {
      this.currentIndex = this.noDefault ? -1 : 0
    }
  }
}
</script>
<style scoped lang="less">
.fac-box-list{
  ul {
    font-size: 14px;
    color: #5e6d82;
    line-height: 2em;
    list-style: none;
    padding: 0;
    border: 1px solid #eaeefb;
  }
  li {
    float: left;
    text-align: center;
    color: #666;
    border-right: 1px solid #eee;
    border-bottom: 1px solid #eee;
    display: list-item;
    cursor: pointer;
    &.col8 {
      width: 12.5%;
    }
    &.col7 {
      width: 14.2%;
    }
    &.col6 {
      width: 16.6%;
    }
    &.col5 {
      width: 20%;
    }
    &.col4 {
      width: 25%;
    }
    &.col3 {
      width: 33.3%;
    }
    &.col2 {
      width: 50%;
    }
    &.col1 {
      width: 100%;
    }
    &.last{
      border-right:0;
    }
    &.only-label{
      height: 40px;
      line-height: 40px;
      text-align: left;
      padding: 0 10px;
    }
    .label{
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: block;
      &:hover{
        text-decoration: underline;
        color: #409EFF
      }
    }
    &.selected {
      background: #409EFF;
      color: #fff;
      .label{
        text-decoration: none;
        background:  #409EFF;
        color: #fff;
      }
    }
  }
  .image-slot{
    font-size: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: #f5f7fa;
    color: #909399;
  }
  .el-image{
    display: block;
  }
}

</style>
