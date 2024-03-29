/*
 * Copyright(c) Oflane Software 2017. All Rights Reserved.
 */
import vueJsonEditor from 'vue-json-editor'
import { codemirror } from 'vue-codemirror'
// 这里引入的是主题样式，根据设置的theme的主题引入，一定要引入！！
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/ambiance.css'
import 'codemirror/theme/ambiance-mobile.css'
import 'codemirror/theme/idea.css'
import 'codemirror/theme/darcula.css'
import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/display/fullscreen.js'
import 'codemirror/addon/display/fullscreen.css'
import 'codemirror/addon/fold/brace-fold.js'
import 'codemirror/addon/fold/comment-fold.js'
import 'codemirror/addon/fold/indent-fold.js'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/search/search.js'
import 'codemirror/addon/search/match-highlighter.js'
import 'codemirror/keymap/sublime.js'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/clike/clike'
import 'codemirror/mode/groovy/groovy'
import 'codemirror/mode/sql/sql'
import '../styles/style.less'

/**
 * 简单组件注册信息
 * @author Paul.Yang E-mail:yaboocn@qq.com
 * @version 1.0 2018-1-22
 */
export default {
  input: {
    tagName: 'el-input',
    props: ['ref', 'vModel', 'placeholder', 'disabled', 'size', 'readonly'],
    config: {

    }
  },
  'input.number': {
    tagName: 'el-input',
    props: ['ref', 'v-model.number', 'placeholder']
  },
  password: {
    tagName: 'el-input',
    props: ['ref', 'vModel', 'placeholder'],
    attrs: {
      type: 'password'
    }
  },
  'switch-box': {
    tagName: 'el-switch',
    props: ['ref', 'vModel', 'activeText', 'inactiveText', 'activeValue', 'inactiveValue', 'activeColor', 'inactiveColor', 'disabled'],
    default: {
      ':activeValue': true,
      ':inactiveValue': false,
      activeColor: '#13ce66',
      inactiveColor: '#ff4949'
    }
  },
  textarea: {
    tagName: 'el-input',
    props: ['ref', 'vModel', 'placeholder', 'rows'],
    attrs: {
      type: 'textarea'
    },
    default: {
      rows: 4
    }
  },
  combo: {
    tagName: 'fac-combo',
    props: ['ref', 'vModel', 'options', 'opCode', 'opUrl', 'disabled', 'placeholder', 'multiple', 'multipleLimit', 'size', 'clearable', 'itemValue', 'itemLabel', '@change']
  },
  date: {
    tagName: 'el-date-picker',
    props: ['ref', 'vModel', 'type', 'pickerOptions', 'placeholder', 'size', 'format', 'valueFormat', 'readonly']
  },
  span: {
    props: ['ref', 'vText', '#content']
  },
  comtext: {
    props: ['ref', 'vModel', 'options', 'opCode', 'opUrl', 'multiple', 'itemValue', 'itemLabel']
  },
  autocomplete: {
    tagName: 'el-autocomplete',
    props: ['ref', 'vModel', 'popperClass', 'placeholder', 'disabled', 'name', 'size', 'value', 'autofocus',
      'fetchSuggestions', 'triggerOnFocus', 'customSugguest', 'sugguest', 'filter', 'ref-to', 'readFields', 'writeFields']
  },
  'el-pagination': {
    tagName: 'el-pagination',
    props: ['ref', '@sizeChange', '@currentChange', 'currentPage', 'pageSizes', 'pageSize', 'total', 'layout'],
    default: {
      ':page-sizes': '[20, 50, 100]',
      layout: 'total, sizes, prev, pager, next, jumper'
    }
  },
  reference: {
    tagName: 'fac-reference',
    props: ['ref', 'popperClass', 'placeholder', 'readonly', 'name', 'size', 'vModel', 'showLabel.sync', 'value', 'showLabel',
      'suggest', 'filter', 'refTo', 'model', 'readFields', 'writeFields', 'refParam', '@change']
  },
  search: {
    tagName: 'fac-search',
    props: ['ref', 'conf', 'page', 'fac', 'loader', 'disabled', '@search']
  },
  xquery: {
    tagName: 'fac-xquery',
    props: ['ref', 'conf', 'page', 'fac', 'loader']
  },
  pagination: {
    tagName: 'fac-pagination',
    props: ['ref', 'conf', 'page', 'fac', 'loader', 'model', '@sizeChange', '@current-change']
  },
  slice: {
    tagName: 'slice',
    props: ['ref', 'conf', 'page', 'fac', 'loader', 'model', 'pageSize', '@sizeChange', '@current-change']
  },
  tree: {
    tagName: 'el-tree',
    props: ['ref', 'data', 'nodeKey', 'load', 'renderContent', 'highlightCurrent:boolean', 'expandOnClickNode:boolean',
      'auto-expand-parent:boolean', 'default-expanded-keys', 'show-checkbox:boolean', 'filter-node-method', '@node-click', '@check-change',
      '@current-change', '@node-expand', '@node-collapse']
  },
  tags: {
    tagName: 'fac-tags',
    props: ['ref', 'single', 'valueField', 'labelField', 'vModel', 'disabled', 'value', 'readonlyValue']
  },
  'simple-tree': {
    tagName: 'simple-tree',
    props: ['ref', 'url', 'lazy', 'label', 'icon', 'search', 'rootName', 'children', 'isLeaf', 'keyword', '@node-click', '@check-change',
      '@current-change', '@node-expand', '@node-collapse']
  },
  'json-editor': {
    component: vueJsonEditor,
    props: ['ref', 'vModel', 'mode', 'modes'],
    attrs: {
      ':showBtns': 'false'
    }
  },
  'input-json': {
    tagName: 'fac-input-json',
    props: ['ref', 'popperClass', 'placeholder', 'name', 'size', 'vModel', 'showLabel.sync', 'value', 'showLabel',
      'editorParam', '@change']
  },
  codemirror: {
    component: codemirror,
    props: ['ref', 'vModel', 'options'],
    default: {
      ':options': {
        theme: 'idea'
      }
    }
  }
}
