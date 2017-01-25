/**
 * Webpack Plugins
 */
const DefinePlugin = require('webpack/lib/DefinePlugin');

const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const commonConfig = require('./webpack.common.js');
const helpers = require('./helpers');

const ENV = process.env.ENV = process.env.NODE_ENV = 'development';

module.exports = webpackMerge(commonConfig, {
  devtool: 'cheap-module-source-map',

  output: {
    path: helpers.root('dist'),
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].map',
    chunkFilename: '[id].chunk.js',
    publicPath: '/'
  },

  plugins: [
    new DefinePlugin({
      'ENV': JSON.stringify(ENV)
    }),
    new ExtractTextPlugin({ filename: '[name].css', disable: false, allChunks: true })
  ],

  devServer: {
    port: 7000,
    historyApiFallback: true,
    stats: 'minimal',
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    }
  }
});
