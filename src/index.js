/*
 * Copyright(c) Oflane Software 2017. All Rights Reserved.
 */
import containers from './containers'
import controls from './controls'
import dialogOpener from './dialog/dialog-opener'
import refs from './refs'
import fase from 'fansion-base'
import fac from 'fansion-fac'

/**
 * 组件集合
 * @type {*[]}
 */
const components = [
  ...containers.components,
  ...controls.components
]
/**
 * 安装方法
 * @param Vue vue对象
 * @param opts 选项
 */
const install = function (Vue, opts = {}) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
  let baseOpts = Object.assign({dialogs: {default: dialogOpener}}, opts.base)
  fase.init(baseOpts)
  let facOpts = Object.assign({components: {...containers.cometa, ...controls.cometa}}, opts.fac)
  fac.init(facOpts)
  refs.init(opts.reference)
}

/**
 * fac组件模块
 * @author Paul.Yang E-mail:yaboocn@qq.com
 * @version 1.0 2017-8-15
 */
export default {
  refs,
  install,
  containers,
  controls,
  dialogOpener
}
