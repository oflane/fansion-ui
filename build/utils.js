const path = require('path')
const fs = require("fs")

module.exports.resolve = function (dir) {
  return path.resolve(process.cwd(), dir)
}
module.exports.join = function () {
  return path.posix.join.apply(path.posix, arguments)
}

module.exports.dependencies = function () {
  //获取module模块
  const packageData = JSON.parse(fs.readFileSync(process.env.npm_package_json))
  //默认模块模式定义
  //与默认的不一样时，需要在package.json中配置  "modulePatterns": ["fansion-(.*)", "fasm-(.*)"],
  let patterns = [/fansion-(.*)/i,/fasm-(.*)/ig]
  if(Array.isArray(packageData.modulePatterns)) {
    patterns = packageData.modulePatterns.map(v => new RegExp(v, "i")).concat(patterns)
  }
  const keys = Object.keys
  const devModules = Object.keys(packageData.devDependencies).filter(v => patterns.findIndex(p => p && p.test(v)) !== -1)
  const modules = packageData.dependencies ? Object.keys(packageData.dependencies).filter(v => patterns.findIndex(p => p && p.test(v)) !== -1) : []
  return modules.concat(devModules)
}
