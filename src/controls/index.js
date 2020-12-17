/*
 * Copyright(c) Oflane Software 2017. All Rights Reserved.
 */

import combo from './combo.vue'
import simpleTree from './simple-tree.vue'
import reference from './reference.vue'
import search from './search.vue'
import xquery from './xquery.vue'
import pagination from './pagination.vue'
import tags from './tags'
import cometa from './cometa'

/**
 * 简单组件集合
 * @author Paul.Yang E-mail:yaboocn@qq.com
 * @version 1.0 2018-1-22
 */
export default {
  /**
   * 简单控件列表
   */
  components: {
    combo,
    reference,
    search,
    xquery,
    pagination,
    tags,
    simpleTree
  },
  /**
   * 简单控件元数据信息
   */
  cometa
}
