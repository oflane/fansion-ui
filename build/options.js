/*
 * Copyright(c) Oflane Software 2017. All Rights Reserved.
 */
//获取module模块
const jsFolder = 'web'
const assertPath = 'static'
module.exports.getOptions = function() {
  return {
    jsFolder,
    assertPath
  }
}
module.exports.convertJsFolder = function(path) {
  return jsFolder + "/" + path
}

module.exports.serverConfig = {
  port: 9998,
  autoOpenBrowser: false
}
module.exports.mock = {
  isMock: true,
  path: '/oflane/',
  url: 'http://localhost:8080',
  proxy: {
    loginUrl: '',
    url: 'http://localhost:8080',
    username: 'hrtest88',
    password: '97bbc79679fe1cfd9afb52fd6f01d033b479555d'
  }
}
