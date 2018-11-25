/* jshint ignore:start */
const merge = require('webpack-merge');
const common = require('./webpack.common');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(common, {
  mode: 'development',
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      templateParameters: {
        SOURCE_PATH: 'src'
      },
      template: 'index.ejs',
    }),
    // new BundleAnalyzerPlugin()
  ],
  devtool: 'source-map'
});
