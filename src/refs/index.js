/*
 * Copyright(c) Oflane Software 2017. All Rights Reserved.
 */

import fase from 'fansion-base'
import defautContainer from './container'
import Vue from 'vue'

/**
 * 获取工具方法
 */
const {gson, furl} = fase.rest
/**
 * 默认引用容器
 * @type {string}
 */
const DAFAULT_CONTAINER = 'default'
/**
 * 引用注册信息
 * @type {{}}
 */
const refs = {}
/**
 * 容器注册信息
 * @type {{}}
 */
const containers = {}
/**
 * 加载引用的url
 * @type {null}
 */
let loadUrl = null
/**
 * 设置默认引用容器
 * @type {{name, props, data, created, methods}}
 */
containers[DAFAULT_CONTAINER] = defautContainer

/**
 * 根据引用编码获取参数信息
 * @param code 引用编码
 * @returns {*}
 */
const ref = code => this.refs[code]

/**
 * 加载引用数据
 * @param data 引用加载url或者引用数据
 * @param cb 回调方法
 * @return {*}
 */
const load = fase.builder.loader(refs, 'code', fase.dialog.buildDialogMeta)

/**
 * 注册引用数据
 * @param data 注册数据
 * @param target 注册目标数据
 * @return {*}
 */
const add = fase.builder.register(refs, 'code', fase.dialog.buildDialogMeta)
/**
 * 根据引用编码获取参数信息
 * @param code 引用编码
 * @param cb 回调方法
 * @returns {*}
 */
const get = (code, cb) => {
  let info = refs[code]
  if (!info) {
    info = fase.dialog.buildDialogMeta(code)
    if (info && info.component) {
      refs[code] = info
      cb(info)
      return
    } else {
      info = null
    }
  }
  const params = {code}
  const url = furl(loadUrl, params)
  info ? cb(info) : loadUrl && load(gson(url, params), () => cb(refs[code]))
}

/**
 * 根据路径取得引用容器
 * @param path 容器路径
 * @returns {*} 容器组件
 */
const getContainer = (path) => path ? containers[path] || containers[DAFAULT_CONTAINER] : containers[DAFAULT_CONTAINER]

/**
 * 注册容器数据
 * @param data 容器数据
 * @return {any}
 */
const addContainer = fase.builder.register(containers, 'path')

/**
 * 设置默认的引用容器
 * @param container 默认的引用容器
 * @return {{}}
 */
const setDefaultContainer = container => (containers[DAFAULT_CONTAINER] = container)

/**
 * 取得默认的引用容器
 * @return {*}
 */
const getDefaultContainer = () => containers[DAFAULT_CONTAINER]

/**
 * 关闭引用全局方法
 * @param data 返回数据
 */
Vue.prototype.$closeReference = function (data) {
  const ref = this.$dialogs.getCurrent().$reference
  fase.util.isFunction(ref.closeReference) && ref.closeReference(data)
  this.$dialogs.closeCurrent(data)
}
/**
 * 打开引用对话框
 * @param vm vue对象
 * @param conf 对象化框配置对象
 * @param options 引用打开选项
 */
const openReference = (vm, conf, options) => {
  if (!conf.dialog && (conf.component && !conf.component.dialog)) {
    if (!conf.container || typeof conf.container === 'string') {
      conf.container = getContainer(conf.container)
    }
  }
  const params = Object.assign({}, conf.params || {}, options.params || {})
  const d = Object.assign({}, conf, options, {params})
  vm.$dialogs.show(d)
}
/**
 * 打开引用组件
 * @param ref 引用组件(引用编码或者引用组件)
 * @param options 引用打开选项
 */
Vue.prototype.$openReference = function (ref, options) {
  const vm = this
  if (typeof ref === 'string') {
    get(ref, (conf) => {
      openReference(vm, conf, options)
    })
    return
  }
  const conf = ref.component ? ref : {component: ref}
  openReference(vm, conf, options)
}

/**
 * 引用加载器，主要负责编码到引用界面的转换
 * @author Paul.Yang E-mail:yaboocn@qq.com
 * @version 1.0 2010/19/18
 */
export default {
  /**
   * 默认容器
   */
  defautContainer,
  /**
   * 引用容器集合
   */
  containers,
  /**
   * 引用集合
   */
  refs,
  /**
   * 根据编码加载单个引用信息的url
   */
  loadUrl,

  /**
   * 根据引用编码获取参数信息
   * @param code 引用编码
   * @returns {*}
   */
  ref,

  /**
   * 加载引用数据
   * @param data 引用加载url或者引用数据
   * @param cb 回调方法
   * @return {*}
   */
  load,
  /**
   *
   */
  add,
  /**
   * 根据引用编码获取参数信息
   * @param code 引用编码
   * @returns {*}
   */
  get,

  /**
   * 根据路径取得引用容器
   * @param path 容器路径
   * @returns {*} 容器组件
   */
  getContainer,

  /**
   * 注册容器数据
   * @param data 容器数据
   * @return {any}
   */
  addContainer,

  /**
   * 设置默认的引用容器
   * @param container 默认的引用容器
   * @return {{}}
   */
  setDefaultContainer,

  /**
   * 取得默认的引用容器
   * @return {*}
   */
  getDefaultContainer,
  /**
   * 初始化数据
   * @param options
   * @returns {*|{name}|Object}
   */
  init: (options) => {
    if (!options) {
      return
    }
    add(options.refs)
    addContainer(options.containers)
    options.loadUrl && (loadUrl = options.loadUrl)
    options.default && setDefaultContainer(options.default)
  }
}
