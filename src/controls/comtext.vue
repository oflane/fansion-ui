<!--
  - Copyright(c) Oflane Software 2017. All Rights Reserved.
  -->

<!--
 --下拉显示组件
 --author Paul.Yang E-mail:yaboocn@qq.com
 --version 1.0 2017-8-24
 -->
<template>
  <span>
    <template v-if="!multiple">{{showText}}</template>
    <template v-if="multiple"><el-tag  v-for="t in showText">{{t}}</el-tag></template>
  </span>
</template>
<script>
  import fase from 'fansion-base'

  /**
   * 引入工具方法
   */
  const isNotEmpty = fase.util.isNotEmpty
  const {getJson, fillRestPath} = fase.rest

  /**
   * 查找显示文本
   * @param multiple 是否多选
   * @param value 值
   * @param options 选项
   * @param vf 选项中的值字段
   * @param lf 选项中的显示文本字段
   */
  const findText = (multiple, value, options, vf, lf, emptyText) => {
    if(!value || !options || options.length === 0) {
      return multiple ? (emptyText ? [emptyText] : []) : emptyText
    }
    if (multiple){
      if(!Array.isArray(value)){
        typeof value === 'string' ? value = value.split(',') : [value.toString()]
      }
      return options.filter(v => value.indexOf(v[vf].toString()) > -1).map(v => v[lf])
    } else {
      value = value.toString()
      return options.find(v => v[vf].toString() === value)[lf]
    }
  }
  /**
   * 下拉显示组件
   * @author Paul.Yang E-mail:yaboocn@qq.com
   * @version 1.0 2018-1-22
   */
  export default {
    name: 'FacCombo',
    props: {
      options: Array,
      opCode: String,
      opUrl: String,
      multiple: Boolean,
      itemValue: {
        type: String,
        default: 'value'
      },
      itemLabel: {
        type: String,
        default: 'label'
      },
      value: [String, Number, Boolean, Object,Array],
      emptyText: String
    },
    data () {
      let vm = this
      let {itemValue, itemLabel, emptyText, value, multiple} = vm
      let showText = ''
      if (!Array.isArray(this.options)) {
        let url
        if (isNotEmpty(this.opUrl)) {
          url = this.opUrl
        } else if (isNotEmpty(this.opCode)) {
          //  根据预置的枚举url加载选项
          url = fillRestPath(window.$fansionUrls['enum-load'], {code: this.optionCode})
        }
        url && getJson(url).then((res) => {
          if (Array.isArray(res) && res.length > 0) {
            vm.options = res
            showText = findText(multiple, value, res, itemValue, itemLabel, emptyText)
          }
        })
      } else {
        showText = findText(multiple, value, vm.options, itemValue, itemLabel, emptyText)
      }
      return {
        showText
      }
    },
    watch: {
      value (v) {
        let vm = this
        let {itemValue, itemLabel, emptyText, multiple} = vm
        vm.showText = findText(multiple, v, vm.options, itemValue, itemLabel, emptyText)
      }
    }
  }
</script>

