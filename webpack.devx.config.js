const path = require('path');
const webpack = require('webpack');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
var merge = require('webpack-merge');

var baseWebpackConfig = require('./webpack.base.js');

// 本地测试路径
const publicPath = 'http://dev.static.lvyuetravel.com/admin-purchase-platform/zh/';
// 测试环境配置
module.exports = merge(baseWebpackConfig, {
  output: {
    publicPath: publicPath
  },
  devtool: 'source-map',
  plugins: [
    //清理
    new CleanWebpackPlugin(['dist'], {
      root: '', //绝对路径
      verbose: true, //写日志到console
      dry: false //不删除任何东西，好进行测试
    }),
    new CopyWebpackPlugin([
      { from: 'static/jquery/jquery.min.js', to:'static/jquery/jquery.min.js'},
      { from: 'static/datepicker/', to:'static/datepicker/'},
      { from: 'static/images/', to:'static/images/'},
      { from: 'static/jquery.checktree.js', to:'static/jquery.checktree.js' }, 
      { from: 'static/select2/js/select2.full.min.js', to:'static/select2/js/select2.full.min.js' },
      { from: 'static/select2/css/select2.min.css', to:'static/select2/css/select2.min.css' },
      { from: 'static/wangEditor/wangEditor.js', to:'static/wangEditor/wangEditor.js' },
      { from: 'static/wangEditor/wangEditor.css', to:'static/wangEditor/wangEditor.css' },
    ]),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
        NODE_COST:'"devx"'
      }
    }),
    new ExtractTextPlugin('css/[name].[hash:8].css', {allChunks: true}),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.BannerPlugin('pms'),
    new HtmlwebpackPlugin({
      filename: 'index.html',
      favicon: 'src/images/logo_artist.ico',
      template: path.resolve(__dirname, './index.html'),
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: false
      },
      chunks: [
        'common', 'index'
      ],
      myStaticPath: publicPath
    })
  ],
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap')
      }, {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap!less-loader')
      }, {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap!sass-loader')
      }
    ]
  }
})
