/* jshint ignore:start */
const merge = require('webpack-merge');
const common = require('./webpack.common');
const uglifycss = require('uglifycss');
const createHash = require('hash-generator');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const cssHash = '.' + createHash(8);

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
    ])
  ],
});
