/* jshint ignore:start */
const merge = require('webpack-merge');
const common = require('./webpack.common');
const uglifycss = require('uglifycss');
const hashFiles = require('hash-files');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OfflinePlugin = require('offline-plugin');

const cssHash = '.' + hashFiles.sync({
  files: './src/index.css',
  algorithm: 'md5'
});

module.exports = merge(common, {
  mode: 'production',
  output: {
    path: __dirname + '/build',
    publicPath: '/',
    filename: 'bundle.[contenthash].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      templateParameters: {
        sourcePath: '',
        cssHash
      },
      template: 'index.ejs',
      filename: 'index.html'
    }),
    new HtmlWebpackPlugin({
      templateParameters: {
        sourcePath: '',
        cssHash
      },
      template: './src/noscript.ejs',
      filename: 'noscript.html',
      inject: false
    }),
    new HtmlWebpackPlugin({
      templateParameters: {
        sourcePath: '',
        cssHash
      },
      template: './src/404.ejs',
      filename: '404.html',
      inject: false
    }),
    new CopyWebpackPlugin([
      { from: './src/favicon.png', to: './' },
      {
        from: './src/index.css',
        to: `./index${cssHash}.css`,
        transform: (c) => uglifycss.processString(c.toString())
      },
      { from: './serve.json', to: './' },
      { from: './_redirects', to: './' }
    ]),
    new OfflinePlugin({
      externals: [
        '/index.html',
        `/index${cssHash}.css`,
        '/noscript.html',
        '/404.html',
        '/favicon.png',
        'https://fonts.googleapis.com/css?family=Montserrat:500,600,800|Karla'
      ],
      excludes: ['_redirects', 'serve.json']
    })
  ],
});
