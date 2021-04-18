const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    port: 9001,
    hot: true,
    compress: true,
    publicPath: '/',
    contentBase: path.join(__dirname, '../dist'),
    historyApiFallback: true
  }
});
