/*
 * Copyright(c) Oflane Software 2017. All Rights Reserved.
 */

import fase from 'fansion-base'

const { message } = fase.util
/**
 * 简化消息
 * @author Paul.Yang E-mail:yaboocn@qq.com
 * @version 1.0 2011/1/18
 */
export default {
  /**
   * 常用消息对象
   */
  success: {
    op: () => message({type: 'success', message: '操作成功!'}),
    del: () => message({type: 'success', message: '删除成功!'}),
    save: () => message({type: 'success', message: '保存成功!'})
  },
  error: {
    op: () => message({ type: 'error', message: '操作失败!' }),
    save: () => message({ type: 'error', message: '保存失败!' }),
    del: () => message({ type: 'error', message: '删除失败'})
  }
}
