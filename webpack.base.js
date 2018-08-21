const path = require('path');
const webpack = require('webpack');


// webpack扩展功能
const alias = require('./bin/alias.js');

module.exports = {
  entry: {
    index: path.resolve(__dirname, 'src/main.js'),
    common: ['react', 'react-dom', 'react-router','axios'],
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'js/[name].[hash:8].js',
    chunkFilename: 'js/[name].[hash:8].js',
  },
  resolve: {
    alias: alias,
    extensions: ['', '.js', '.jsx', '.less', '.scss', '.css'],
  },
  externals: {
    jquery: 'window.jQuery',
  },
  plugins: [
    // 给经常使用的模块分配最小长度的ID
    new webpack.optimize.OccurenceOrderPlugin(),
    // 保证编译后的代码永远是对的，因为不对的话会自动停掉
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin('common', 'js/common.[hash:8].js'),
  ],
  devServer: {
    historyApiFallback: true, // 在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
    port:8084,
    hot: true,
    inline: true, // 设置为true，当源文件改变时会自动刷新页面
    progress: true,
    disableHostCheck:true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    proxy: {
      '/pmp':{
        target: 'http://dev.pimp.lvyuetravel.com/',
        pathRewrite: {'^/pmp' : ''},
        changeOrigin: true,
        host: 'lvyuetravel.com',
      },
      '/admin':{
        target: 'http://test.admin-property.lvyuetravel.com/',
        pathRewrite: {'^/admin' : ''},
        changeOrigin: true,
        host: 'lvyuetravel.com'
      },
      '/pms':{
        target: 'http://test.pms.lvyuetravel.com',
        pathRewrite: {'^/pms' : ''},
        changeOrigin: true,
        host: 'lvyuetravel.com',
      },
      '/mock': {
        target: 'https://www.easy-mock.com',
        changeOrigin: true,
      },
    },
  },
  postcss: [
    require('autoprefixer')
  ],
  module: {
    loaders: [
      {
        test: /\.(?:js|jsx)$/,
        loaders: ['babel'],
        exclude: /node_modules/,
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.(png|jpg|jepg|gif)$/,
        loader: 'url-loader?limit=8192&name=images/[name].[ext]',
      },
      {
        test: /\.(woff|woff2|svg|eot|ttf)\??.*$/,
        loader:'url-loader?name=fonts/[name].[ext]',
        // loader: 'file?name=./static/fonts/[name].[ext]',
      }
    ],
  },
};
