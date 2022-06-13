const mock = require('./options').mock
const express = require('express')
const {createProxyMiddleware} = require('http-proxy-middleware')
const fetch = import('node-fetch')
const mockContext = '/mock'
const mockPath = './mock'
const resolvePath = require('./utils').resolve
const reg = /(\/[^?]*)(\?.*)?/
const rootPath = resolvePath('../')
  /**
 * build rest request proxy config
 * @returns {*} proxy options
 */
function mockOptions () {
  let headers = {}
  if (mock.isMock) {
    /* rewrite to mock file */
    return {
      filter: function (req, res, next) {
        if (req.url.startsWith(mock.path)) {
          let url = reg.exec(req.url)[1]
          if (req.method === 'POST') {
            console.log('提交数据:')
            console.log(req.body)
            res.sendFile(rootPath + url.replace(mock.path, mockContext + '/') + '.json')
            return
          }
          req.url = url.replace(mock.path, mockContext + '/') + '.json'
        }
        next()
      }
    }
  }
  /* proxy back end request */
  return {
    proxy: {
      path: `${mock.path}**`,
      options: {
        target: mock.url,
        changeOrigin: false, // needed for virtual hosted sites
        ws: true // proxy websockets
      }
    },
    filter: function (req, res, next) {
      if (!req.originalPath || !new RegExp(req.originalPath).test(mock.path)) {
        next()
        return
      }
      let proxyOption = mock.proxy
      if (!proxyOption.loginUrl || proxyOption.loginUrl === '') {
        next()
        return
      }
      let url = `${proxyOption.loginUrl}?username=${proxyOption.username}&password=${proxyOption.password}`
      fetch(url).then(function (rr) {
        return rr.json()
      }).then(function (json) {
        headers.Authority = 'u_logints=' + json.u_logints + '; u_usercode=' + json.u_usercode + '; token=' + json.token + '; tenantid=' + json.tenantid
        next()
      }).catch(function (err) {
        console.log(err)
      })
    }
  }
}

module.exports = function (app) {
  let m = mockOptions()
  // if (typeof m.filter === 'function') {
  //   app.use(m.filter)
  // }
  app.use(mockContext, express.static(mockPath))
  if (!m.proxy) {
    return
  }
  if (Array.isArray(m.proxy)) {
    m.proxy.forEach(function (p) {
      app.use(createProxyMiddleware(p.path, p.options))
    })
  } else {
    console.log(JSON.stringify(m.proxy))
    app.use(createProxyMiddleware(m.proxy.path, m.proxy.options))
  }
}
