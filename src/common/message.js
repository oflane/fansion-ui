/*
 * Copyright(c) Oflane Software 2017. All Rights Reserved.
 */

import Vue from 'vue'
import fase from 'fansion-base'

const isNull = fase.util.isNull
/**
 * 消息显示扩展
 * @author Paul.Yang E-mail:yaboocn@qq.com
 * @version 1.0 201/8/19
 */
Vue.prototype.$msg = ({type = 'info', message, items, html, autoClose, iconClass, customClass, duration, showClose = false, onClose, center=false}) => {

  let hasItem = items && items.length > 0
  if (!message && !hasItem) {
    console.log('$msg is call but not message content!')
    return
  }
  if (isNull(html) && hasItem) {
    html = true
  }
  let dangerouslyUseHTMLString = html
  if (hasItem) {
    if (html) {
      let itemHtml = items.map(i => `<li>${i}</li>`).join('')
      message = `<p class="msg"><label>${message}</label><u>${itemHtml}</u>`
    } else {
      message = `${message}<br/>${items.join('<br/>')}`
    }
  }

  if (isNull(autoClose) && type === 'error') {
    autoClose = false
  }
  if (!autoClose) {
    showClose = true
    duration = 0
  }
  this.$message({type, message, iconClass, customClass, duration, dangerouslyUseHTMLString, showClose, onClose, center})
}
