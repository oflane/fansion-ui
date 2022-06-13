import pages from './test-page'
import fase from 'fansion-base'

const install = (Vue, opt = {}) => {
  fase.init({
    pages: {
      pageComps: pages
    },
    router: {
      routes: Object.keys(pages)
    }
  })
}

/**
 * 组件入口
 * @author Paul.Yang E-mail:yaboocn@qq.com
 * @version 1.0 2011/13/18
 */
export default {
  install
}
