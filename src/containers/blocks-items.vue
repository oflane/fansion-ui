<!--
 --块状分组列表
 --author Paul.Yang E-mail:yaboocn@qq.com
 --version 1.0 205/19/20
 -->
<template>
  <div class="block-container">
    <div :class="getBlockClass(block, $index)" v-for="(block, $index) in model" :key="block.id">
      <div class="block-box" :style="{borderTopColor: getTopColor(block, $index)}">
        <slot name="title">
          <span class="title"><el-link @click="blockClick(block, $event)" :icon="iconBlock(block)" >{{ block[blockLabel]}}</el-link></span>
          <i class="main-close el-icon-close" @click="blockClose(block, $event)" v-if="isBlockClose(block)"></i>
        </slot>
        <slot>
          <ul class="body">
            <li v-for="item in subChildren(block[children])" :key="item.id"><el-link @click="itemClick(item, block, $event)" :icon="iconItem(item, block, block)">{{item[itemLabel]}}</el-link> <i class="el-icon-close" @click="itemClose(item, block, $event)" v-if="isItemClose(block)"></i></li>
          </ul>
        </slot>
        <slot name="popover">
          <el-popover class="item-more" placement="left" trigger="click"  v-if="block.children && block.children.length > foldCount">
            <ul class="popover-body">
              <li v-for="item in block[children]" :key="item.id"><el-link @click="itemClick(item, block, $event)">{{item[itemLabel]}}</el-link><i class="el-icon-close" @click="itemClose(item, block, $event)" v-if="isItemClose(block)"></i></li>
            </ul>
            <el-link slot="reference">{{ moreLabel }} <i class="el-icon-d-arrow-right" slot="icon"></i></el-link>
          </el-popover>
        </slot>
        <slot name="popover">
          <div class="footer">
            <el-link v-if="!isAddLink(block)">&nbsp;</el-link>
            <el-link :icon="iconAdd(block)" @click="addClick(block, $event)" v-if="isAddLink(block)">{{ addButtonLabel(block) }}</el-link>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>
<script>
import fase from 'fansion-base'
const isFunction = fase.util.isFunction

export default {
  name: 'FacBlocksItems',
  props: {
    page: Object,
    fac: Object,
    /**
     * 数据
     */
    model: {
      type: Array,
      default: _ => []
    },
    /**
     * 显示列数
     */
    cols: {
      type: Number,
      default: 4
    },
    /**
     * 分组块标签字段
     */
    blockLabel: {
      type: String,
      default: 'label'
    },
    /**
     * 分组块是否带有关闭
     */
    hasBlockClose: {
      type: [Boolean, Function],
      default: true
    },
    /**
     * 分组块图表
     */
    blockIcon: [String, Function],
    /**
     * 分组块样式
     */
    blockClass: [String, Function],
    /**
     * 顶部颜色
     */
    topColor: [String, Function],
    /**
     * 添加按钮标签
     */
    addLabel: {
      type: [String, Function],
      defaultValue: '添加条目'
    },
    /**
     * 添加图标
     */
    addIcon: {
      type: [String, Function],
      default: 'el-icon-plus'
    },
    /**
     * 是否存在添加
     */
    hasAdd: {
      type: [Boolean, Function],
      default: true
    },
    /**
     * 更多按钮文字
     */
    moreLabel: {
      type: String,
      default: '更多'
    },
    /**
     * 子条目属性
     */
    children: {
      type: String,
      default: 'children'
    },
    /**
     * 子条目图标
     */
    itemIcon: {
      type: [String, Function],
      default: 'el-icon-right'
    },
    /**
     * 子条目名称
     */
    itemLabel: {
      type: String,
      default: 'label'
    },
    /**
     * 子条目是否有关闭
     */
    hasItemClose: {
      type: [Boolean, Function],
      default: true
    },
    /**
     * 折叠条目数
     */
    foldCount: {
      type: Number,
      default: 3
    }
  },
  methods: {
    subChildren (rs) {
      if (!rs) {
        rs = []
      }
      return rs.length > this.foldCount ? rs.slice(0, this.foldCount) : rs
    },
    getBlockClass (block, i) {
      const cols = this.cols
      const model = this.model
      const blockClass = this.blockClass
      let bc = blockClass ? (isFunction(blockClass) ? blockClass(block, i, model) : blockClass) || '' : ''
      if (bc.length > 0) {
        bc = ' ' + bc
      }
      return ((this.model.length === i + 1 || i % cols === cols - 1) ? 'block last block-' + cols : 'block block-' + cols) + bc
    },
    getTopColor (block, i) {
      const topColor = this.topColor
      const model = this.model
      return topColor && (isFunction(topColor) ? topColor(block, i, model) : topColor)
    },
    iconBlock (block) {
      const blockIcon = this.blockIcon
      const model = this.model
      return blockIcon && (isFunction(blockIcon) ? blockIcon(block, model) : blockIcon)
    },
    isBlockClose (block) {
      const hasBlockClose = this.hasBlockClose
      const model = this.model
      return isFunction(hasBlockClose) ? hasBlockClose(block, model) : hasBlockClose
    },
    addButtonLabel (block) {
      const addLabel = this.addLabel
      const model = this.model
      return isFunction(addLabel) ? addLabel(block, model) : addLabel
    },
    iconItem (item, block) {
      const itemIcon = this.itemIcon
      const model = this.model
      return isFunction(itemIcon) ? itemIcon(item, block, model) : itemIcon
    },
    isItemClose (item, block) {
      const hasItemClose = this.hasItemClose
      const model = this.model
      return isFunction(hasItemClose) ? hasItemClose(item, block, model) : hasItemClose
    },
    iconAdd (block) {
      const addIcon = this.addIcon
      const model = this.model
      return isFunction(addIcon) ? addIcon(block, model) : addIcon
    },
    isAddLink (block) {
      const hasAdd = this.hasAdd
      const model = this.model
      return isFunction(hasAdd) ? hasAdd(block, model) : hasAdd
    },
    blockClick (block, e) {
      this.$emit('block-click', block, e)
    },
    blockClose (block, e) {
      this.$emit('block-close', block, e)
    },
    itemClick (item, block, e) {
      this.$emit('item-click', item, block, e)
    },
    itemClose (item, block, e) {
      this.$emit('item-close', item, block, e)
    },
    addClick (block, e) {
      this.$emit('add', block, e)
    }
  }
}
</script>
<style scoped lang="less">
  .block-container{
    .block {
      padding: 10px 0 0 0;
      border-right: 1px solid #eff2f6;
      display: inline-block;
      width: 25%;
      box-sizing: border-box;
      vertical-align: top;
      &.last {
        border-right: none;
      }
    }
    .block-3 {
      width: 33.3%;
    }
    .block-4 {
      width: 25%;
    }
    .block-5 {
      width: 20%;
    }
  }
  .block-box  {
    padding: 10px;
    margin: 0 10px;
    overflow: hidden;
    position: relative;
    background: #fff;
    border: 1px solid #dee9f4;
    border-top: 3px solid #E6A23C;
    -webkit-box-shadow: 0 2px 4px 0 #dee9f4;
    box-shadow: 0 2px 4px 0 #dee9f4;
    cursor: pointer;
    box-sizing: border-box;
    height:100%;
    .title{
      font-weight: bold;
      display: inline-block;
      width: 100%;
      vertical-align: middle;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .el-link{
        display: inline;
      }
    }
    .main-close.el-icon-close{
      border-radius: 50%;
      cursor: pointer;
      right:5px;
      top: 5px;
      color: #363636;
      position: absolute;
      &:hover{
        color: #fff;
        background-color:#909399;
      }
    }
    .body{
      height:65px;
      margin: 5px 10px;
      font-size: 11px;
      padding-left:5px;
      li{
        padding-bottom: 2px;
      }
      .el-link{
        font-size: 11px;
      }
      .el-icon-close{
        border-radius: 50%;
        cursor: pointer;
        color: #363636;
        margin-top: 4px;
        float: right;
        &:hover{
          color: #fff;
          background-color:#909399;
        }
      }
    }
    .footer{
      text-align: center;
      .el-link{
        font-size: 11px;
      }
    }
    .item-more{
      position: absolute;
      right: 10px;
      bottom: 10px;
      .el-link{
        font-size: 11px;
      }
    }
  }
  .popover-body{
    li{
      padding: 3px;
    }
    .el-link{
      font-size: 12px;
    }
    .el-icon-close{
      border-radius: 50%;
      cursor: pointer;
      color: #363636;
      float: right;
      font-size: 12px;
      margin-top: 4px;
      &:hover{
        color: #fff;
        background-color:#909399;
      }
    }
  }
</style>
