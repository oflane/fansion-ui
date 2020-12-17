/*
 * Copyright(c) Oflane Software 2017. All Rights Reserved.
 */
import containers from './containers'
import controls from './controls'
import dialogOpener from './common/dialog-opener'
import './common/message'
import refs from './refs'
import fase from 'fansion-base'
import fac from 'fansion-fac'
import generator from './generator'
import handler from './handler'
import constant from './constant'
import msg from './msg'
import sortDialog from './pages/sort-dailog'
// 页面注册
const pageComps = {
  '/ui/page/sort-dialog': sortDialog
}

/**
 * 安装方法
 * @param Vue vue对象
 * @param opts 选项
 */
const install = function (Vue, opts = {}) {
  [
    ...Object.values(containers.components),
    ...Object.values(controls.components)
  ].forEach(component => {
    Vue.component(component.name, component)
  })
  init(opts)
  fase.init({pages: {pageComps}, dialogs: {default: dialogOpener}})
  Vue.use(fac)
  fac.init({cometas: {...containers.cometa, ...controls.cometa}})
}
/**
 * 初始化方法
 * @param opts 选项
 */
const init = function (opts = {}) {
  opts.references && refs.init(opts.references)
}
/**
 * fac组件
 * @author Paul.Yang E-mail:yaboocn@qq.com
 * @version 1.0 2017-8-15
 */
export default {
  refs,
  install,
  init,
  containers,
  controls,
  dialogOpener,
  ...containers.components,
  ...controls.components,
  generator,
  handler,
  msg,
  constant
}
