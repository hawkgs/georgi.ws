/* jshint ignore:start */
const { merge } = require('webpack-merge');
const path = require('path');
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
    },
    static: {
      directory: path.resolve(__dirname, 'src'),
      publicPath: '/'
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      templateParameters: {
        sourcePath: '',
        cssHash: ''
      },
      template: 'index.ejs',
      filename: 'index.html'
    }),
    new HtmlWebpackPlugin({
      templateParameters: {
        sourcePath: '',
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
