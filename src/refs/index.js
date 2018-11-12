/*
 * Copyright(c) Oflane Software 2017. All Rights Reserved.
 */

import fase from 'fansion-base'
import defautContainer from './container'

/**
 * 获取工具方法
 */
const {getJson, fillRestPath} = fase.rest
/**
 * 默认参照容器
 * @type {string}
 */
const DAFAULT_CONTAINER = 'default'
/**
 * 参照注册信息
 * @type {{}}
 */
let refs = {}
/**
 * 容器注册信息
 * @type {{}}
 */
let containers = {}
/**
 * 家子安书记的url
 * @type {null}
 */
let loadUrl = null
/**
 * 设置默认参照容器
 * @type {{name, props, data, created, methods}}
 */
containers[DAFAULT_CONTAINER] = defautContainer

/**
 * 根据参照编码获取参数信息
 * @param code 参照编码
 * @returns {*}
 */
const ref = code => this.refs[code]

/**
 * 加载参照数据
 * @param data 参照加载url或者参照数据
 * @param cb 回调方法
 * @return {*}
 */
const load = fase.builder.loader(refs, 'code')
/**
 * 根据参照编码获取参数信息
 * @param code 参照编码
 * @returns {*}
 */
const get = (code, cb) => {
  let info = refs[code]
  let params = {code}
  let url = fillRestPath(loadUrl, params)
  info ? cb(info) : loadUrl && load(getJson(url, params), () => cb(refs[code]))
}

/**
 * 根据路径取得参照容器
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
 * 设置默认的参照容器
 * @param container 默认的参照容器
 * @return {{}}
 */
const setDefaultContainer = container => (containers[DAFAULT_CONTAINER] = containers)

/**
 * 取得默认的参照容器
 * @return {*}
 */
const getDefaultContainer = () => containers[DAFAULT_CONTAINER]

/**
 * 参照加载器，主要负责编码到参照界面的转换
 * @author Paul.Yang E-mail:yaboocn@qq.com
 * @version 1.0 2010/19/18
 */
export default {
  /**
   * 默认容器
   */
  defautContainer,
  /**
   * 参照容器集合
   */
  containers,
  /**
   * 参照集合
   */
  refs,
  /**
   * 根据编码加载单个参照信息的url
   */
  loadUrl,

  /**
   * 根据参照编码获取参数信息
   * @param code 参照编码
   * @returns {*}
   */
  ref,

  /**
   * 加载参照数据
   * @param data 参照加载url或者参照数据
   * @param cb 回调方法
   * @return {*}
   */
  load,
  /**
   * 根据参照编码获取参数信息
   * @param code 参照编码
   * @returns {*}
   */
  get,

  /**
   * 根据路径取得参照容器
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
   * 设置默认的参照容器
   * @param container 默认的参照容器
   * @return {{}}
   */
  setDefaultContainer,

  /**
   * 取得默认的参照容器
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
    addContainer(options.containers)
    loadUrl = options.loadUrl
    options.default && setDefaultContainer(options.default)
  }
}
