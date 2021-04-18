const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: false,
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, '../build')
  },
  optimization: {
    runtimeChunk: false,
    splitChunks: {
      // include all types of chunks
      chunks: 'all'
    }
  }
});
