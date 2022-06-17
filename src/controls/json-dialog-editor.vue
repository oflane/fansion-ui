<template>
  <el-dialog :visible.sync="visible" title="Json编辑器">
    <json-editor v-model="value"/>
    <div slot="footer">
      <el-button type="primary" @click="onOk">确定</el-button>
      <el-button @click="onCancel">取消</el-button>
      <el-button @click="onClear">清除</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import vueJsonEditor from 'vue-json-editor'

  export default {
    name: 'JsonDialogEditor',
    dialog: true,
    props: {
      value: String
    },
    components: {
      jsonEditor: vueJsonEditor
    },
    methods: {
      onOk () {
        const value = this.value
        this.$closeDialogEditor({value, label: value})
      },
      onCancel () {
        this.$closeDialogEditor()
      },
      onClear () {
        this.$closeDialogEditor({})
      }
    }
  }
</script>
