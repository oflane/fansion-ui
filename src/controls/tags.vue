<!--
  - Copyright(c) Oflane Software 2017. All Rights Reserved.
  -->

<!--
 --标签控件
 --author Paul.Yang E-mail:yaboocn@qq.com
 --version 1.0 209/12/18
 -->
<template>
  <div class="fac-tags">
    <el-tag
      :key="$index"
      v-for="(item, $index) in items"
      :closable="closable"
      :disable-transitions="false"
      @close="handleClose(item,$index)">
      {{label(item)}}
    </el-tag><el-input
      class="input-new-tag"
      v-if="inputVisible && single"
      v-model="inputValue"
      ref="saveTagInput"
      size="small"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm"
    /><el-button v-else-if="single && closable" class="button-new-tag" size="small" @click="showInputEditor">+</el-button>
    <el-popover v-if="!single"
      placement="bottom"
      width="300"
      v-model="popoverVisble" @hide="onPopoverHide">
      <fac-form ref="popoverForm" :conf="itemForm"　:model="itemModel"　css="popover-form" label-width="80px" :gutter="2"/>
      <div style="text-align: right; margin: 0">
        <el-button type="primary" size="mini" @click="handlePopoverConfirm">确定</el-button>
        <el-button size="mini" type="text" @click="handlePopoverCancel">取消</el-button>
      </div>
      <el-button slot="reference" class="button-new-tag">+</el-button>
    </el-popover>
  </div>
</template>
<script>
  import FacForm from '../containers/fac-form'
  /**
   * 标签控组件
   * @author Paul.Yang E-mail:yaboocn@qq.com
   * @version 1.0 2018-1-22
   */
  export default {
    name: 'FacTags',
    components: {FacForm},
    props: {
      single: {
        type: Boolean,
        default: true
      },
      valueField: {
        type: String,
        default: 'value'
      },
      labelField: {
        type: String,
        default: 'label'
      },
      value: Array,
      disabled: Boolean
    },
    data () {
      let items = this.value || []
      let itemForm = {
        cols: 1,
        items: [
          {
            type: 'input',
            label: '值: ',
            field: 'value',
            validation: [
              {
                'required': true,
                'message': '值不能为空',
                'trigger': 'blur'
              }
            ]
          },
          {
            type: 'input',
            label: '文本: ',
            field: 'label',
            validation: [
              {
                'required': true,
                'message': '文本不能为空',
                'trigger': 'blur'
              }
            ]
          }
        ]
      }
      return {
        items,
        inputVisible: false,
        inputValue: '',
        popoverVisble: false,
        itemForm,
        itemModel: {},
        closable: !this.disabled
      }
    },
    methods: {
      label (item) {
        return this.single ? item : item[this.labelField]
      },
      handleClose (item, index) {
        this.items.splice(index, 1)
        this.$emit('input', this.items)
      },
      showInputEditor () {
        this.inputVisible = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },
      handleInputConfirm () {
        let inputValue = this.inputValue
        if (inputValue) {
          this.items.push(inputValue)
        }
        this.$emit('input', this.items)
        this.inputVisible = false
        this.inputValue = ''
      },
      handlePopoverConfirm () {
        this.$refs['popoverForm'].validate(valid => {
          if (!valid) {
            return
          }
          let m = this.itemModel
          let item = {}
          item[this.valueField] = m.value
          item[this.labelField] = m.label
          this.items.push(item)
          this.$emit('input', this.items)
          m.value = ''
          m.label = ''
          this.popoverVisble = false
        })
      },
      handlePopoverCancel () {
        let m = this.itemModel
        m.value = ''
        m.label = ''
        this.popoverVisble = false
      },
      onPopoverHide () {
        this.$refs['popoverForm'].clearValidate()
      }
    }
  }
</script>
<style lang="less">
  .fac-tags {
    .el-tag + .el-tag {
      margin-left: 10px;
    }
    .button-new-tag {
      margin-top: -1px;
      margin-left: 10px;
      height: 32px;
      line-height: 30px;
      padding-top: 0;
      padding-bottom: 0;
    }
    .input-new-tag {
      width: 90px;
      margin-left: 10px;
      vertical-align: bottom;
    }

  }
  .fac-form.popover-form {
    background: none 0px 0px repeat scroll rgb(255, 255, 255);
    border-radius: 3px;
    .form-body{
      padding: 30px;
    }
    .el-form-item {
      margin-bottom: 26px;
    }
    .el-autocomplete,.el-select{
      display: block;
    }
  }
  .popover-form.fac-form-cols1{
    .form-body{
      padding: 0;
    }
    .el-col {
      padding-left: 0!important;
      padding-right: 0!important;
    }
    .el-form-item__label{
      line-height: 30px;
    }
    .el-input__inner{
      height:30px;
    }
  }
</style>
