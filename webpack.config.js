/* jshint ignore:start */
module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname + 'build',
    publicPath: '/dist/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['to-string-loader', 'css-loader']
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            attrs: false
          }
        }
      },
      {
        test: /\.(png|jpg|gif|md)$/,
        use: [
          {
            loader: 'file-loader',
            options: {}
          }
        ]
      },
      {
        test: /.(txt|md|markdown)$/,
        use: 'raw-loader'
      },
      {
        test: /\.(jpe?g|png|gif|ico)$/i,
        loader: 'file-loader?name=[name].[ext]'
      }
    ]
  },
  devtool: 'source-map'
};
