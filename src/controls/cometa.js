/*
 * Copyright(c) Oflane Software 2017. All Rights Reserved.
 */
import vueJsonEditor from 'vue-json-editor'
import '../styles/style.less'

/**
 * 简单组件注册信息
 * @author Paul.Yang E-mail:yaboocn@qq.com
 * @version 1.0 2018-1-22
 */
export default {
  input: {
    tagName: 'el-input',
    props: ['ref', 'vModel', 'placeholder', 'disabled', 'size'],
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
    attrs: {type: 'password'}
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
    attrs: {type: 'textarea'},
    default: {
      'rows': 4
    }
  },
  'json-editor': {
    component: vueJsonEditor,
    props: ['ref', 'vModel', 'mode', 'modes'],
    attrs: {
      ':showBtns': 'false'
    }
  },
  'combo': {
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
  'autocomplete': {
    tagName: 'el-autocomplete',
    props: ['ref', 'vModel', 'popperClass', 'placeholder', 'disabled', 'name', 'size', 'value', 'autofocus',
      'fetchSuggestions', 'triggerOnFocus', 'customSugguest', 'sugguest', 'filter', 'ref-to', 'readFields', 'writeFields']
  },
  'el-pagination': {
    tagName: 'el-pagination',
    props: ['ref', '@sizeChange', '@currentChange', 'currentPage', 'pageSizes', 'pageSize', 'total', 'layout'],
    default: {
      ':page-sizes': '[20, 50, 100]',
      'layout': 'total, sizes, prev, pager, next, jumper'
    }
  },
  reference: {
    tagName: 'fac-reference',
    props: ['ref', 'popperClass', 'placeholder', 'readonly', 'name', 'size', 'vModel', 'showLabel.sync', 'value', 'showLabel',
      'suggest', 'filter', 'refTo', 'readFields', 'writeFields']
  },
  search: {
    tagName: 'fac-search',
    props: ['ref', 'conf', 'page', 'loader', 'disabled', '@search']
  },
  xquery: {
    tagName: 'fac-xquery',
    props: ['ref', 'conf', 'page', 'loader']
  },
  'pagination': {
    tagName: 'fac-pagination',
    props: ['ref', 'conf', 'page', 'loader', 'model', '@sizeChange', '@current-change']
  },
  tree: {
    tagName: 'el-tree',
    props: ['ref', 'data', 'node-key', 'load', 'renderContent', 'highlightCurrent:boolean', 'expandOnClickNode:boolean',
      'auto-expand-parent:boolean', 'default-expanded-keys', 'show-checkbox:boolean', 'filter-node-method', '@node-click', '@check-change',
      '@current-change', '@node-expand', '@node-collapse']
  },
  tags: {
    tagName: 'fac-tags',
    props: ['ref', 'single', 'valueField', 'labelField', 'vModel', 'disabled', 'value', 'readonlyValue']
  }
}
