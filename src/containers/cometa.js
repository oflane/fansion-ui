/*
 * Copyright(c) Oflane Software 2017. All Rights Reserved.
 */
import facForm from './fac-form.vue'
import facTable from './fac-table.vue'
import simpleTable from './simple-table'
import tabs from './tabs'
import buttonBar from './button-bar.vue'
import cardList from './card-list.vue'
/**
 * 容器组件注册信息
 * @author Paul.Yang E-mail:yaboocn@qq.com
 * @version 1.0 2018-1-22
 */
export default {
  'button-bar': {
    component: buttonBar,
    props: ['page', 'conf']
  },
  'fac-form': {
    component: facForm,
    props: ['ref', 'page', 'conf', 'model']
  },
  'fac-table': {
    component: facTable,
    props: ['page', 'conf', 'model', 'loader', 'selection']
  },
  'card-list': {
    component: cardList,
    props: ['page', 'model', 'card', 'css', 'comps', 'before', 'end']
  },
  'simple-table': {
    component: simpleTable.component,
    props: ['type', 'columns', 'model', 'slot', 'loader', 'selection']
  },
  'fac-tabs': tabs
}
