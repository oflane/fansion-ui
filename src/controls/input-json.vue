<!--
 --对话框选择组件
 --author Paul.Yang E-mail:yaboocn@qq.com
 --version 1.0 2017-8-24
 -->
<script>
import InputEditor from './input-editor'
import JsonDialogEditor from './json-dialog-editor'

/**
 * json对话框编辑组件
 * @author Paul.Yang E-mail:yaboocn@qq.com
 * @version 1.0 2018-1-22
 */
export default {
  name: 'FacInputJson',
  componentName: 'InputJson',
  extends: InputEditor,
  data: function () {
    return {
      dialogEditor: JsonDialogEditor
    }
  }
}
</script>
