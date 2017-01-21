const webpack = require('webpack');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


const helpers = require('./helpers');

const METADATA = {
  title: 'Angular2 Webpack2',
  baseUrl: '/',
  isDevServer: helpers.isWebpackDevServer()
};
module.exports = {
  devtool: 'cheap-module-source-map',
  entry: {
    'polyfills': './src/polyfills.ts',
    'vendor':    './src/vendor.ts',
    'main':      './src/main.ts'
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    modules: [helpers.root('src'), helpers.root('node_modules')]
  },
  module: {
    rules: [
      /*{
        enforce: 'pre',
        test: /\.ts$/,
        loader: 'tslint-loader',
        exclude: [/\.(spec|e2e)\.ts$/, /node_modules/]
      },*/
      {
        test: /\.ts$/,
        loaders: 'awesome-typescript-loader',
        exclude: [/\.(spec|e2e)\.ts$/]
      },
      {
        test: /\.ts$/,
        loaders: 'angular2-template-loader',
        exclude: [/\.(spec|e2e)\.ts$/]
      },
      {
        test: /\.ts$/,
        loader: 'ng-router-loader',
        options: {},
        exclude: [/\.(spec|e2e)\.ts$/]
      },
      {
        test: /\.ts$/,
        loaders: '@angularclass/hmr-loader',
        exclude: [/\.(spec|e2e)\.ts$/]
      },
      {
        test: /\.json$/,
        use: 'json-loader'
      },
      {
        test: /\.html$/,
        use: 'raw-loader',
        exclude: [helpers.root('src/index.html')]
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: 'file-loader'
      },
      {
        test: /\.css$/,
        exclude: [helpers.root('src', 'app')],
        loader: ExtractTextPlugin
          .extract({
            fallbackLoader: 'style-loader',
            loader: [
              { loader: 'css-loader', query: { modules: true, sourceMaps: true } },
                'postcss-loader'
              ]
          })
      },
      {
        test: /\.css$/,
        include: [helpers.root('src', 'app')],
        loader: ['raw-loader','postcss-loader']
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loaders: ['raw-loader', 'sass-loader']
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      }
    ]
  },
  plugins: [
    new CommonsChunkPlugin({
      name: ['app', 'vendor', 'polyfills']
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      title: METADATA.title,
      metadata: METADATA,
      inject: 'body',
      hash: true
    }),
    new LoaderOptionsPlugin({
        options: {
            tslint: {
                emitErrors: true,
                failOnHint: true
            },
            postcss: [
              require('autoprefixer')
            ]
        }
    })
  ]
};
