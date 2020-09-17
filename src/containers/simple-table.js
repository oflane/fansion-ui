/*
 * Copyright(c) Oflane Software 2017. All Rights Reserved.
 */

import fac from 'fansion-fac'
import fase from 'fansion-base'
import tableSort from './table-sort'

/**
 * 获取工具方法
 */
const {toProps} = fase.render
const {confs2Comps} = fac.comps

/**
 * 默认的表格配置
 * @type {{border: boolean, style: string}}
 */
const defaultTable = {
  border: true,
  style: 'width: 100%'
}
/**
 * 默认的列表列配置
 * @type {{fixed: boolean, sortable: boolean, headerAlign: string}}
 */
const defaultColumn = {
  fixed: false,
  sortable: false,
  headerAlign: 'center'
}
/**
 * 列属性排除的名称
 * @type {string[]}
 */
const exclude = ['comps', 'template']
/**
 * 列属性别名
 * @type {{field: string}}
 */
const alias = {field: 'prop'}
/**
 * 根据列配置
 * @param columns 列配置数组
 * @param components 组件注册对象
 * @returns {*}
 */
const buildColumn = (columns, components) => columns.filter(column => column && !column.ignore).map(column => {
  const c = Object.assign({}, defaultColumn, column)
  const colProps = toProps(c, exclude, alias)
  if (c.selection) {
    console.log(c)
    if (!c.width) {
      c.width = '35px'
    }
    if (c.fixed === null || c.fixed === undefined || c.fixed === '') {
      c.fixed = true
    }
    return `<el-table-column type="selection" ${colProps}/>`
  } else if (column.columns && column.columns.length > 0) {
    const children = buildColumn(column.columns, components)
    return `<el-table-column label="${column.label}"><templat>${children}</templat></el-table-column>`
  } else if (column.template) {
    confs2Comps(column.components, components)
    return `<el-table-column ${colProps}><template slot-scope="scope">${column.template}</template></el-table-column>`
  } else {
    return `<el-table-column ${colProps}/>`
  }
})

/**
 * 简单表格的配置封装
 * @author Paul.Yang E-mail:yaboocn@qq.com
 * @version 1.0 2017-8-14
 */
export default {
  /**
   * 默认的表格配置
   */
  defaultTable,
  /**
   * 字段构建方法
   */
  buildColumn,
  /**
   * 简单表格组件方法
   * @param conf
   * @returns {{name: string, template: string, components: {tableSort: {props, data, methods}}}}
   */
  component: (conf) => {
    if (Array.isArray(conf)) {
      conf = {
        columns: conf
      }
    }
    if (conf.selection) {
      conf.columns = [{selection: true}, ...conf.columns]
    }
    const options = Object.assign({}, defaultTable, conf)
    const tableProps = toProps(options, ['type', 'columns', 'model', 'pos', 'loader', 'selection'])
    const components = {
      tableSort
    }
    let columnTemplate = buildColumn(conf.columns, components)
    const slot = conf.pos ? ` slot="${conf.pos}"` : ''
    const model = conf.model || conf[':model'] || 'model'
    if (conf[':loader']) {
      columnTemplate += '<table-sort ref="tableSort" :loader="' + conf[':loader'] + '"/>'
    }
    let sortMethod = ''
    if (conf[':loader'] && !options['@sort-change'] && !options['@sortChange']) {
      sortMethod = '@sort-change="$refs[\'tableSort\'].setSort(...arguments)"'
    }
    return {
      name: 'SimpleTable',
      template: `<el-table ${sortMethod} :data="${model}" ${tableProps} ${slot}>${columnTemplate}</el-table>`,
      components
    }
  }
}
