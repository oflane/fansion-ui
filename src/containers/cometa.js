/*
 * Copyright(c) Oflane Software 2017. All Rights Reserved.
 */
import simpleTable from './simple-table'
import tabs from './tabs'

/**
 * 容器组件注册信息
 * @author Paul.Yang E-mail:yaboocn@qq.com
 * @version 1.0 2018-1-22
 */
export default {
  'button-bar': {
    tagName: 'fac-button-bar',
    props: ['page', 'conf']
  },
  'fac-form': {
    tagName: 'fac-form',
    props: ['ref', 'page', 'fac', 'conf', 'model', 'ignore']
  },
  'fac-table': {
    tagName: 'fac-table',
    props: ['ref', 'page', 'fac', 'conf', 'model', 'loader', 'selection']
  },
  'fac-list': {
    tagName: 'fac-list',
    props: ['ref', 'page', 'fac', 'model', 'label', 'sortable']
  },
  'card-list': {
    tagName: 'fac-card-list',
    props: ['ref', 'page', 'fac', 'model', 'conf', 'css', 'comps', 'before', 'end']
  },
  'item-list': {
    tagName: 'fac-item-list',
    props: ['ref', 'page', 'fac', 'model', 'current', 'label', 'image', 'key', 'noDefault']
  },
  'box-list': {
    tagName: 'fac-box-list',
    props: ['ref', 'page', 'fac', 'model', 'vModel', 'label', 'cols', 'selectEnable', 'staticIcon', 'previewImage', 'image', 'icon', 'key', 'noDefault', '@click', '@dblclick']
  },
  'blocks-items': {
    tagName: 'fac-blocks-items',
    props: ['ref', 'page', 'fac', 'model', 'cols', 'blockLabel', 'hasBlockClose', 'blockIcon', 'topColor', 'addLabel', 'addIcon', 'hasAdd', 'moreLabel', 'children', 'itemIcon', 'itemLabel', 'hasItemClose', 'foldCount']
  },
  'simple-table': {
    component: simpleTable.component,
    props: ['type', 'columns', 'model', 'slot', 'loader', 'selection']
  },
  'fac-tabs': tabs,
  'fac-transfer': {
    tagName: 'fac-transfer',
    props: ['ref', 'fac', 'data', 'selected', 'filterable', 'props']
  },
}
