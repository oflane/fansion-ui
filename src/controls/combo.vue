<!--
 --下拉选择组件
 --author Paul.Yang E-mail:yaboocn@qq.com
 --version 1.0 2017-8-24
 -->
<template>
  <el-select :value="value" @input="handleChange" @change="onSelectChange" :placeholder="placeholder" :size="size" :disabled="disabled" :filterable="filterable" :multiple="multiple" :multiple-limit="multipleLimit">
    <el-option
      v-for="item in options"
      :key="item[itemValue]"
      :label="item[itemLabel]"
      :value="item[itemValue]">
    </el-option>
  </el-select>
</template>
<script>
  import fase from 'fansion-base'

  /**
   * 引入工具方法
   */
  const isNotEmpty = fase.util.isNotEmpty
  const {getJson, fillRestPath} = fase.rest

  /**
   * 下拉选择组件
   * @author Paul.Yang E-mail:yaboocn@qq.com
   * @version 1.0 2018-1-22
   */
  export default {
    name: 'FacCombo',
    props: {
      options: Array,
      opCode: String,
      opUrl: String,
      placeholder: String,
      itemValue: {
        type: String,
        default: 'value'
      },
      itemLabel: {
        type: String,
        default: 'label'
      },
      value: [String, Number, Boolean, Object],
      size: String,
      disabled: Boolean,
      clearable: Boolean,
      filterable: Boolean,
      multiple: Boolean,
      multipleLimit: {
        type: Number,
        default: 0
      }
    },
    data () {
      let _self = this
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
            _self.options = res
          }
        })
      }
      return {
      }
    },
    methods: {
      handleChange (val) {
        this.$emit('input', val)
      },
      onSelectChange (val) {
        this.$emit('change', val)
      }
    }
  }
</script>

