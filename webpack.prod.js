/* jshint ignore:start */
const merge = require('webpack-merge');
const common = require('./webpack.common');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
        SOURCE_PATH: ''
      },
      template: 'index.ejs',
    }),
    new CopyWebpackPlugin([
      { from: './src/index.css', to: './' },
      { from: './src/favicon.png', to: './' }
    ])
  ],
});
