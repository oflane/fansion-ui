<!--
 --对话框选择组件
 --author Paul.Yang E-mail:yaboocn@qq.com
 --version 1.0 2017-8-24
 -->
<template>
  <div class="input-editor">
    <el-input
      ref="input"
      v-model="nativeLabel"
      :readonly="true"
      :disabled="disabled"
      :placeholder="placeholder"
      :name="name"
      :size="size"
      @mouseenter.native="inputHovering = true"
      @mouseleave.native="inputHovering = false"
    >
      <span slot="suffix">
        <i class="el-icon-circle-close is-show-close" @click="deleteSelected" v-show="clearIcon"></i>
        <i class="el-input__icon fa fa-umbrella is-clickable" @click.stop="handleIconClick"></i>
      </span>
    </el-input>
  </div>
</template>
<script>
  import Vue from 'vue'
  import fase from 'fansion-base'
  import Emitter from 'element-ui/lib/mixins/emitter'
  /**
   * 引入基础对象及方法
   */
  const {isNotEmpty} = fase.util

  /**
   * 关闭对话框编辑组件全局方法
   * @param data 返回数据
   */
  Vue.prototype.$closeDialogEditor = function (data) {
    const dialogEditor = this.$dialogs.getCurrent().$dialogEditor
    fase.util.isFunction(dialogEditor.closeDialogEditor) && dialogEditor.closeDialogEditor(data)
    this.$dialogs.closeCurrent(data)
  }
  /**
   * 打开对话框编辑组件
   * @param dialogEditor 对话框编辑组件
   * @param options 引用打开选项
   */
  Vue.prototype.$openDialogEditor = function (dialogEditor, options) {
    const vm = this
    const conf = dialogEditor.component ? dialogEditor : {component: dialogEditor}
    const params = Object.assign({}, conf.params || {}, options.params || {})
    const d = Object.assign({}, conf, options, {params})
    vm.$dialogs.show(d)
  }

  /**
   * 对话框编辑组件
   * @author Paul.Yang E-mail:yaboocn@qq.com
   * @version 1.0 2018-1-22
   */
  export default {
    name: 'FacInputEditor',
    componentName: 'InputEditor',
    mixins: [Emitter],
    props: {
      popperClass: String,
      placeholder: {
        type: String,
        default: '请打开对话框编辑'
      },
      disabled: Boolean,
      name: String,
      size: String,
      value: String,
      showLabel: String,
      editor: [String, Object],
      editorParam: Object,
      clearable: {
        type: Boolean,
        default: true
      }
    },
    data: function () {
      return {
        dialogEditor: this.editor,
        onlyValue: true,
        nativeLabel: this.onlyValue === false ? this.value : this.showLabel,
        inputHovering: false
      }
    },
    computed: {
      clearIcon () {
        return this.clearable &&
          this.inputHovering &&
          !this.disabled &&
          isNotEmpty(this.showLabel)
      }
    },
    watch: {
      value (v) {
        if (this.onlyValue && this.nativeLabel !== v) {
          this.nativeLabel = v
        }
      },
      showLabel (v) {
        if (!this.onlyValue && this.nativeLabel !== v) {
          this.nativeLabel = v
        }
      },
      editor (editor) {
        this.dialogEditor = editor
      }
    },
    methods: {
      select (item) {
        if (item && this.value !== item.value) {
          const label = this.onlyValue ? item.value : item.label
          this.$emit('input', item.value)
          this.$emit('update:showLabel', label)
          this.$emit('change', item)
        }
      },
      handleIconClick () {
        this.showDialogEditor()
      },
      setParams (params, isClear = true) {
        if (this.editorParam === params) {
          return
        }
        this.editorParam = params
        if (isClear) {
          this.$emit('input', null)
          this.$emit('update:showLabel', null)
        }
        this.refresh = true
      },
      getDialogOptions () {
        const vm = this
        return {
          params: Object.assign({}, vm.editorParam, {value: vm.value, label: vm.nativeLabel}),
          dep: '#' + vm.getElmID(),
          refresh: vm.refresh,
          '@open': ($event) => {
            vm.$dialogs.getCurrent().$reference = vm
            $event && $event.reset && $event.reset()
          }
        }
      },
      showDialogEditor () {
        const vm = this
        const editor = vm.dialogEditor
        editor && vm.$openDialogEditor(editor, vm.getDialogOptions())
      },
      closeDialogEditor (item) {
        if (item) {
          this.select(item)
        }
        this.$emit('afterEdit', item, this)
      },
      /**
       * @desc: 清空操作  1.已经选中过数据，现在清空数据 2.还未选中数据，只是清除掉输入框中的值
       */
      deleteSelected () {
        if (this.value) {
          this.select({})
        } else {
          this.$emit('input', null)
          this.$emit('update:showLabel', null)
        }
      }
    }
  }
</script>
<style lang="less" scoped>
.input-editor {
  position: relative;
  display: inline-block;
  width:100%;
}
</style>
