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
    <template v-for="(item, $index) in items">
      <el-tag
        :key="$index"
        v-if="!single||currentEditIndex!=$index"
        :closable="isEdit(item)"
        :disable-transitions="false"
        @close="handleClose(item,$index)">
        <a @click="handleEdit($event, item,$index)" href="javascript:void(0)">{{label(item)}}</a>
      </el-tag>
      <el-input
        class="input-new-tag"
        v-if="single&&currentEditIndex==$index"
        v-model="inputValue"
        ref="saveEditTagInput"
        size="small"
        @keyup.enter.native="handleEditInputConfirm"
        @blur="handleEditInputConfirm"
      />
    </template>
    <el-input
      class="input-new-tag"
      v-if="inputVisible && single"
      v-model="inputValue"
      ref="saveTagInput"
      size="small"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm"
    /><el-button v-else-if="closable" class="button-new-tag" size="small" @click="showInputEditor($event, this)">+</el-button>
    <el-popover v-if="!single && closable"
      placement="bottom"
      width="300"
      :reference="reference"
      v-model="popoverVisble" @hide="onPopoverHide" :popper-options="popover">
      <fac-form ref="popoverForm" :conf="itemForm" :model="itemModel"　css="popover-form" label-width="80px" :gutter="2"/>
      <div style="text-align: right; margin: 0">
        <el-button type="primary" size="mini" @click="handlePopoverConfirm">确定</el-button>
        <el-button size="mini" type="text" @click="handlePopoverCancel">取消</el-button>
      </div>
      <div  ref="popover" slot="reference" style="position:absolute;"/>
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
        default: false
      },
      valueField: {
        type: String,
        default: 'value'
      },
      labelField: {
        type: String,
        default: 'label'
      },
      value: [Array, String],
      readonlyValue: [Array, String],
      disabled: Boolean,
      resultString: Boolean
    },
    data () {
      let items = this.value || []
      if (typeof items === 'string') {
        try {
          items = JSON.parse(items)
        } catch (e) {
          items = items.split(',')
        }
      }
      let readonlys = []
      if (this.readonlyValue) {
        readonlys = Array.isArray(this.readonlyValue) ? this.readonlyValue : this.readonlyValue.split(',')
      }
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
        popover: {positionFixed: true},
        items,
        currentEditIndex: -1,
        inputVisible: false,
        inputValue: '',
        popoverVisble: false,
        itemForm,
        itemModel: {
          value: null,
          label: null
        },
        readonlys,
        closable: !this.disabled
      }
    },
    methods: {
      label (item) {
        return this.single ? item : item[this.labelField]
      },
      isEdit (item) {
        let val = this.single ? item : item[this.valueField]
        return this.closable && (this.readonlys.length === 0 || this.readonlys.indexOf(val) < 0)
      },
      handleClose (item, index) {
        this.items.splice(index, 1)
        this.$emit('input', this.getValue())
      },
      setPosition (ss) {
        let pop = this.$refs.popover
        pop.style.left = ss.offsetLeft + (ss.offsetWidth / 2) + 'px'
        pop.style.top = ss.offsetTop + ss.offsetHeight + 'px'
      },
      showInputEditor () {
        let vm = this
        if (vm.single) {
          this.inputValue = ''
          vm.inputVisible = true
          vm.$nextTick(_ => {
            vm.$refs.saveTagInput.$refs.input.focus()
          })
        } else {
          let m = vm.itemModel
          m.value = null
          m.label = null
          let ss = event.srcElement
          vm.setPosition(ss)
          vm.popoverVisble = true
        }
      },
      handleInputConfirm () {
        let inputValue = this.inputValue
        if (inputValue) {
          this.items.push(inputValue)
          this.$emit('input', this.getValue())
        }
        this.inputVisible = false
        this.inputValue = ''
      },
      getValue () {
        return this.resultString ? JSON.stringify(this.items) : [...this.items]
      },
      handleEditInputConfirm () {
        let inputValue = this.inputValue
        let i = this.currentEditIndex
        let items = this.items
        let change = items[i] !== inputValue
        if (inputValue) {
          items[i] = inputValue
        } else {
          items.splice(i, 1)
        }
        if (change) {
          this.$emit('input', this.getValue())
        }
        this.currentEditIndex = -1
        this.inputValue = ''
      },
      handleEdit (event, item, $index) {
        let vm = this
        if (!vm.isEdit(item)) {
          return
        }
        vm.currentEditIndex = $index
        if (!vm.single) {
          let m = vm.itemModel
          m.value = item[vm.valueField]
          m.label = item[vm.labelField]
          let ss = event.srcElement.parentElement
          vm.setPosition(ss)
          vm.popoverVisble = true
        } else {
          vm.inputValue = item
          vm.$nextTick(_ => {
            vm.$refs.saveEditTagInput[0].$refs.input.focus()
          })
        }
      },
      handlePopoverConfirm () {
        let vm = this
        vm.$refs['popoverForm'].validate(valid => {
          if (!valid) {
            return
          }
          let m = vm.itemModel
          let i = vm.currentEditIndex
          let item = i > -1 ? vm.items[i] : {}
          item[vm.valueField] = m.value
          item[vm.labelField] = m.label
          if (i === -1) {
            vm.items.push(item)
          }
          vm.$emit('input', this.items)
          vm.currentEditIndex = -1
          m.value = null
          m.label = null
          vm.popoverVisble = false
        })
      },
      handlePopoverCancel () {
        let vm = this
        let m = vm.itemModel
        m.value = ''
        m.label = ''
        vm.currentEditIndex = -1
        vm.popoverVisble = false
      },
      onPopoverHide () {
        let vm = this
        let m = vm.itemModel
        m.value = ''
        m.label = ''
        vm.currentEditIndex = -1
        vm.$refs['popoverForm'].clearValidate()
      }
    }
  }
</script>
<style lang="less">
  .fac-tags {
    height: 40px;
    .el-tag {
      margin-right: 10px;
    }
    .button-new-tag {
      margin-top: -3px;
      vertical-align: middle;
      height: 32px;
      line-height: 30px;
      padding-top: 0;
      padding-bottom: 0;
    }
    .input-new-tag {
      width: 90px;
      margin-right: 10px;
      line-height: 30px;
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
    .el-input__icon{
      line-height: 30px;
    }
  }
</style>
