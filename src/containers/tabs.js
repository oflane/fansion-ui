/*
 * Copyright(c) Oflane Software 2017. All Rights Reserved.
 */
import fac from 'fansion-fac'
import fase from 'fansion-base'

/**
 * 获取工具方法
 */
const toProps = fase.render.toProps
const getPageMeta = fase.pages.getPageMeta
const confs2Comps = fac.comps.confs2Comps
/**
 * 每个tab子标签构建
 * @param items 子标签数组
 * @param components 组件对象
 * @return {string} 模板串
 */
const buildTabItems = (items, components) => items.map((item, index) => {
  let itemSlot
  let tabProps
  if (item.icon) {
    const exclude = ['label', 'icon', 'component']
    itemSlot = `<span slot="label"><i class="${item.icon}"></i>item.label</span>`
    tabProps = toProps(item, exclude)
  } else {
    itemSlot = ''
    const exclude = ['component']
    tabProps = toProps(item, exclude)
  }
  if (item.template) {
    confs2Comps(item.components, components)
    return `<el-tab-pane ${tabProps}>${itemSlot}${item.template}</el-tab-pane>`
  }
  if (item.component) {
    if (typeof item.component === 'string') {
      let {props, component} = getPageMeta(item.component)
      props = toProps(props)
      const tagName = component.name || 'child' + index
      components[tagName] = component
      return `<el-tab-pane ${tabProps}>${itemSlot}<${tagName} ${props}/></el-tab-pane>`
    }
    const tagName = item.component.name || 'child' + index
    components[tagName] = item.component
    return `<el-tab-pane ${tabProps}>${itemSlot}<${tagName}/></el-tab-pane>`
  }
  return `<el-tab-pane ${tabProps}>${itemSlot}${item.html}</el-tab-pane>`
}).join(' ')

/**
 * tab页签封装
 * @author Paul.Yang E-mail:yaboocn@qq.com
 * @version 1.0 2017-8-14
 */
export default (conf) => {
  const tabsProps = toProps(conf, ['type', 'conf', 'items', 'pos'], {'tab-type': 'type'})
  const components = {}
  const tabTmpls = buildTabItems(conf.items, components)
  const slot = conf.pos ? ` slot="${conf.pos}"` : ''
  console.log(`<el-tabs ${tabsProps} ${slot}>${tabTmpls}</el-tabs>`)
  return {
    name: 'FaceTabs',
    template: `<el-tabs ${tabsProps} ${slot}>${tabTmpls}</el-tabs>`,
    components
  }
}
