/* jshint ignore:start */
const merge = require('webpack-merge');
const common = require('./webpack.common');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    historyApiFallback: {
      rewrites: [
        { from: '/p', to: '/index.html' }
      ]
    }
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      templateParameters: {
        sourcePath: '/src',
        cssHash: ''
      },
      template: 'index.ejs',
      filename: 'index.html'
    }),
    new HtmlWebpackPlugin({
      templateParameters: {
        sourcePath: '/src',
        cssHash: ''
      },
      template: './src/noscript.ejs',
      filename: './src/noscript.html',
      inject: false
    }),
    // new BundleAnalyzerPlugin()
  ],
  devtool: 'source-map'
});
