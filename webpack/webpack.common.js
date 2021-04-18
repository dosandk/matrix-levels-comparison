const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  target: 'web',
  entry: {
    matrix: path.join(__dirname, '../src/index.js'),
  },
  output: {
    publicPath: '/',
    filename: '[name].bundle.js',
    path: path.join(__dirname, '../dist'),
    chunkFilename: '[name]-[id].js'
  },
  module: {
    rules: [
      {
        test: /\.md$/,
        use: [
          {
            loader: "raw-loader",
          }
        ],
      },
      {
        test: /\.(js)?$/,
        use: [
          {
            loader: 'babel-loader'
          },
        ],
        exclude: [/(node_modules)/]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../src/index.html')
    }),
  ]
};
