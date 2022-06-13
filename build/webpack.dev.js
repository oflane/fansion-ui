/*
 * Copyright(c) Oflane Software 2017. All Rights Reserved.
 */
const utils = require('./utils')
const resolve = utils.resolve
const join = utils.join
const mode = process.env.NODE_ENV
const options = require('./options').getOptions(mode)
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  mode: mode,
  entry:{app: ['./build/dev-client', './node_modules/fansion-env/main.js','./src/test.js']},
  output: {
    path: resolve('./'),
    filename: '[name].js',
    chunkFilename: '[name].bundle.js?[chunkhash]',
    publicPath: '/'
  },
  externals: {
    vue: 'Vue',
    // 'element-ui': 'ELEMENT',
    'vue-router': 'VueRouter'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '~': resolve('src'),
      '@static': resolve('static'),
      '@data': resolve('data')
    }
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre"
      },
      {
        test: /\.(js|jsx|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.(jsx?|babel|es6)$/,
        include: resolve('./src'),
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          preserveWhitespace: false
        }
      },
      {
        test: /\.json$/,
        type: 'javascript/auto',
        loader: 'json-loader'
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.less$/,
        loaders: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.html$/,
        loader: 'html-loader?minimize=false'
      },
      {
        test: /\.otf|ttf|woff2?|eot(\?\S*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: join(options.assertPath, '[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.svg(\?\S*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: join(options.assertPath, '[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(gif|png|jpe?g)(\?\S*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: join(options.assertPath, '[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env': mode,
      'process.env.entry': JSON.stringify(resolve('./src/test')),
      'process.env.contextPath': JSON.stringify('/oflane'),
      'process.env.ContextData': JSON.stringify(resolve('./data/nav.json')),
      'process.env.routeLoader': null,
      'process.env.urlsLoader': null
    }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './node_modules/fansion-env/index.html',
      inject: true
    }),
    new FriendlyErrorsPlugin()
  ],
  optimization: {
    noEmitOnErrors: true
  }
}
