/*
 * Copyright(c) Oflane Software 2017. All Rights Reserved.
 */
//获取module模块
const {dependencies, resolve} = require("./utils")
const {getOptions, convertJsFolder} = require("./options")
const options = getOptions()
const modules = dependencies()
const mappingPaths = Array.isArray(modules) ? modules.map(m => ['/' + convertJsFolder(m)+'/','./node_modules/'+m+'/lib/']) : []
mappingPaths.push(['/cdn/', './node_modules/fansion-env/cdn/'])

const copyPaths = Array.isArray(modules) ? modules.flatMap(m => [{from: 'node_modules/'+ m +'/lib', to: convertJsFolder(m), ignore: [m+".js", '.*', '*.map', '*.css', 'static/**/*']}, {from: 'node_modules/'+ m +'/lib/'+options.assertPath, to: convertJsFolder(options.assertPath)}]) : []
copyPaths.push({from: resolve(options.assertPath), to: convertJsFolder(options.assertPath), ignore: ['.*']})

module.exports = {
  modules,
  mappingPaths,
  copyPaths
}
