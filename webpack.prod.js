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
    }),
    new CopyWebpackPlugin([
      { from: './src/favicon.png', to: './' },
      { from: './src/noscript.html', to: './' },
      {
        from: './src/index.css',
        to: `./index${cssHash}.css`,
        transform: (c) => uglifycss.processString(c.toString())
      },
    ]),
    new OfflinePlugin({
      externals: [
        '/index.html',
        `/index${cssHash}.css`,
        '/noscript.html',
        '/favicon.png',
        'https://fonts.googleapis.com/css?family=Montserrat:500,600,800|Karla'
      ]
    })
  ],
});
