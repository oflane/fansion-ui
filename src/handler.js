/*
 * Copyright(c) Oflane Software 2017. All Rights Reserved.
 */

import fase from 'fansion-base'

const {fillRestPath, post} = fase.rest
/**
 * 确认操作处理
 * @param vm vue组件对象
 * @param handler 确认后的处理方法
 * @param msg 确认提示消息
 * @param csg 取消提示消息
 */
const confirm = (vm, handler, msg, csg) => {
  vm.$confirm(msg || '操作确认, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(handler).catch(() => {
    this.$message({
      type: 'info',
      message: csg || '已取消操作'
    })
  })
}
/**
 * 确认操作处理{}
 * @param vm vue组件对象
 * @param handler 确认后的处理方法
 * @param msg 确认提示消息
 * @param csg 取消提示消息
 * @param canceler 取消时处理
 */
const confirmHandle = ({vm, handler, canceler, msg, csg}) => {
  vm.$confirm(msg || '操作确认, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(handler).catch(canceler || (() => {
    this.$message({
      type: 'info',
      message: csg || '已取消操作'
    })
  }))
}
/**
 * 确认操作处理
 * @param vm vue组件对象
 * @param url 删除url
 * @param row 行对象
 * @param success 成功后处理
 * @param fail 失败后处理
 * @param msg 确认提示消息
 * @param loading 加载状态字段
 */
const delRow = ({vm, url, row, success, fail, msg, loading, valid}) => {
  confirm(vm, () => {
    if (valid && !valid()) {
      return
    }
    loading && (vm[loading] = true)
    url = fillRestPath(url, row)
    fail = fail || (() => {
      vm.$message({type: 'error', message: '删除失败'})
    })
    post(url).then(success).catch(fail).finally(() => {
      loading && (vm[loading] = false)
    })
  }, msg || '删除数据操作, 是否继续?')
}
/**
 * 表单代理
 * @type {{validate: (function(*): *)}}
 */
const formProxy = {
  validate: f => f(true)
}
/**
 * 保存数据
 * @param vm vue组件对象
 * @param url 保存url
 * @param form 表单对象
 * @param model 模型
 * @param success 成功后处理
 * @param fail 失败后处理
 * @param final 保存后的最终处理
 * @param loading 加载状态字段
 */
const saveData = ({vm, url, form, model, success, fail, final, loading}) => {
  let formCtrl = !form ? formProxy : typeof form === 'string' ? vm.$refs[form] : typeof form === 'function' ? form() : form
  formCtrl.validate(valid => {
    if (!valid) {
      return
    }
    loading && (vm[loading] = true)
    let data = typeof model === 'string' ? vm[model] : typeof model === 'function' ? model() : model
    post(url, data).then(success || fase.constant.EMPTY_FUNC).catch(fail || fase.constant.EMPTY_FUNC).finally(() => {
      loading && (vm[loading] = false)
      final && final()
    })
  })
}
/**
 * 设置页面标题
 * @param vm vue组件对象
 * @param title 标题
 */
const setPageTitle = (vm, title) => (vm.$navigator.title = title)

/**
 * 判断当前参数是否为新增id
 * @param val 标识值
 * @return {boolean}
 */
const isAdd = (val) => val === fase.constant.ADD_ID
/**
 * 简化处理工具方法
 * @author Paul.Yang E-mail:yaboocn@qq.com
 * @version 1.0 2011/1/18
 */
export default {
  /**
   * 设置页面标题
   * @param vm vue组件对象
   * @param title 标题
   */
  setPageTitle,

  /**
   * 判断当前参数是否为新增id
   * @param val 标识值
   * @return {boolean}
   */
  isAdd,
  /**
   * 确认操作处理
   * @param vm vue组件对象
   * @param handler 确认后的处理方法
   * @param msg 确认提示消息
   * @param csg 取消提示消息
   */
  confirm,
  /**
   * 确认操作处理{}
   * @param vm vue组件对象
   * @param handler 确认后的处理方法
   * @param msg 确认提示消息
   * @param csg 取消提示消息
   * @param canceler 取消时处理
   */
  confirmHandle,
  /**
   * 确认操作处理
   * @param vm vue组件对象
   * @param url 删除url
   * @param row 行对象
   * @param success 成功后处理
   * @param fail 失败后处理
   * @param msg 确认提示消息
   * @param loading 加载状态字段
   */
  delRow,
  /**
   * 保存数据
   * @param vm vue组件对象
   * @param url 保存url
   * @param form 表单对象
   * @param model 模型
   * @param success 成功后处理
   * @param fail 失败后处理
   * @param final 保存后的最终处理
   * @param loading 加载状态字段
   */
  saveData
}
