const path = require('path');
const webpack = require('webpack');

const HtmlwebpackPlugin = require('html-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');

// cdn路径
const publicPath = 'http://cxf.lvyuetravel.com:8080';

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
    extensions: ['*', '.js', '.jsx', '.less', '.scss', '.css'],
  },
  externals: {
    jquery: 'window.jQuery',
  },
  plugins: [
    // 给经常使用的模块分配最小长度的ID
    new webpack.optimize.OccurenceOrderPlugin(),
    // 热替换，不用刷新页面
    new webpack.HotModuleReplacementPlugin(),
    // 保证编译后的代码永远是对的，因为不对的话会自动停掉
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"dev"',
      },
    }),
    new ExtractTextPlugin({filename:'css/[name].[hash:8].css',allChunks: true}),
    new webpack.optimize.CommonsChunkPlugin('common', 'js/common.[hash:8].js'),
    new OpenBrowserPlugin({
      url: publicPath,
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
  devtool: 'eval-source-map',
  devServer: {
    historyApiFallback: true, // 在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
    hot: true,
    inline: true, // 设置为true，当源文件改变时会自动刷新页面
    progress: true,
    disableHostCheck:true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    proxy: {
      '/api': {
        target: 'http://srm.quhuhu.com',
        changeOrigin: true,
      },
      '/mock': {
        target: 'https://www.easy-mock.com',
        changeOrigin: true,
      },
      '/mock2': {
        target: 'https://www.easy-mock.com',
        changeOrigin: true,
      },
      '/mockjs': {
        target: 'http://rapapi.org',
        changeOrigin: true,
      },
      '/user':  {
        target: 'http://pms.lvyuetravel.com',
        changeOrigin: true,
      },
      '/privilege':  {
        target: 'http://pms.lvyuetravel.com',
        changeOrigin: true,
      },
      '/pms':{
        target: 'http://test.pms.lvyuetravel.com:8080/',
        pathRewrite: {'^/pms' : ''},
        changeOrigin: true,
        host: 'lvyuetravel.com',
      },
      '/sapi/*': {
        changeOrigin: true,
        target: 'http://newshop.m.beta.yinyuetai.com/',
        host: 'yinyuetai.com',
      },
    },
  },
  postcss: [
    require('autoprefixer')
  ],
  module: {
    loaders: [
      {
        test: /\.css$/,
        // loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap'),
        loader: 'style-loader!css-loader?sourceMap',
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader?sourceMap!less-loader',
      },
      {
        test: /\.scss$/,
        // loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap!sass-loader'),
        loader: 'style-loader!css-loader?sourceMap!sass-loader',
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
