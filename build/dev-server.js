require('./check-versions')()
const proxy = require('./dev-proxy')
const {serverConfig,getOptions} = require('./options')
const {mappingPaths} = require('./modules')
const opn = require('open')
const path = require('path')
const express = require('express')
const webpack = require('webpack')
const webpackConfig = require('./webpack.dev')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development'
}
const options = getOptions('development')
// default port where dev server listens for incoming traffic
const port = process.env.PORT || serverConfig.port
// automatically open browser, if not set will be false
const autoOpenBrowser = !!serverConfig.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware

let server = express()
let compiler = webpack(webpackConfig)

let devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: 'none',
  watchOptions: {
    ignored: '/node_modules/**',
    poll: 1000
  },
  quiet: true
})

let hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {
    //console.log(...arguments)
  }
})
// force page reload when html-webpack-plugin template changes
compiler.hooks.compilation.tap('html-webpack-plugin-after-emit', function () {
  hotMiddleware.publish({action: 'reload'})
})
// app.use(bodyParser.json({limit: '1mb'}))
// app.use(bodyParser.urlencoded({
//   extended: true
// }))
// proxy api requests
proxy(server)
// handle fallback for HTML5 history API
server.use(require('connect-history-api-fallback')())
// serve webpack bundle output
server.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
server.use(hotMiddleware)

// serve pure static assets
server.use(path.posix.join('/', options.assertPath), express.static('./static', {maxAge: 1000 * 60 * 60}))
mappingPaths.forEach(([p, sp]) => server.use(p, express.static(sp, {maxAge: 1000 * 60 * 60})))


let uri = 'http://localhost:' + port

let _resolve
let readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})
let listener = server.listen(port)
module.exports = {
  ready: readyPromise,
  close: () => {
    listener.close()
  }
}
