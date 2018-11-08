/*
 * Copyright(c) Oflane Software 2017. All Rights Reserved.
 */

/**
 * 生成按钮列
 * @param buttons 按钮列表
 */
const cardListButton = buttons => '<span class="buttons">' + buttons.map(v => `<el-button type="text" class="button" @click="page.${v.click}">${v.text}</el-button>`).join() + '</span>'
/**
 * 生成列表列按钮
 * @param buttons
 * @returns {*}
 */
const columnButton = buttons => buttons.map(v => `<el-button type="text" class="button" size="small" @click="page.${v.click}">${v.text}</el-button>`).join()

/**
 * 代码生成工具
 * @author Paul.Yang E-mail:yaboocn@qq.com
 * @version 1.0 2011/1/18
 */
export default {
  /**
   * 生成按钮列
   * @param buttons 按钮列表
   */
  cardListButton,
  /**
   * 生成列表列按钮
   * @param buttons
   * @returns {*}
   */
  columnButton
}
