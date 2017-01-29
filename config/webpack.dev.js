const fs = require('fs');

/**
 * Webpack Plugins
 */
const DefinePlugin = require('webpack/lib/DefinePlugin');

const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const commonConfig = require('./webpack.common.js');
const helpers = require('./helpers');

const ENVIROMENT = process.env.NODE_ENV = process.env.ENV = 'development';
const METADATA = fs.readFileSync(`${helpers.root('src','env')}/development.json`,'utf8');
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 7000;


module.exports = webpackMerge(commonConfig, {
  devtool: 'cheap-module-source-map',

  output: {
    path: helpers.root('dist'),
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].map',
    chunkFilename: '[id].chunk.js'
  },

  plugins: [
    new DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(ENVIROMENT),
        'METADATA': METADATA
      }
    }),
    new ExtractTextPlugin({ filename: '[name].css', disable: false, allChunks: true })
  ],

  devServer: {
    port: PORT,
    host: HOST,
    historyApiFallback: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    }
  }
});
