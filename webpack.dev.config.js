const path = require('path');
const webpack = require('webpack');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlwebpackPlugin = require('html-webpack-plugin');
var merge = require('webpack-merge');

var baseWebpackConfig = require('./webpack.base.js');

const BrowerlicPath = 'http://dev.lvyuetravel.com:8084';

const publicPath = '/';
// 测试环境配置
module.exports =merge(baseWebpackConfig,{
  output: {
    publicPath: publicPath
  },
  devtool: 'eval-source-map',
  plugins:[
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"dev"',
        NODE_COST:'"developer"'
      },
    }),
    // 热替换，不用刷新页面
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('css/[name].[hash:8].css', {
      allChunks: true,
    }),
    new OpenBrowserPlugin({
      url: BrowerlicPath,
    }),
    new HtmlwebpackPlugin({
      filename: 'index.html',
      favicon:'src/images/logo_artist.ico',
      template: path.resolve(__dirname, './index.html'),
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: false,
      },
      chunks: ['common', 'index'],
      myStaticPath:publicPath
    }),
  ],
  module:{
    loaders:[
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader?sourceMap',
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader?sourceMap!less-loader',
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader?sourceMap!sass-loader',
      },
    ]
  }
})
