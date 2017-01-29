const webpack = require('webpack');

/**
 * Webpack Plugins
 */
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');

/**
 * External Plugins
 */
const AssetsPlugin = require('assets-webpack-plugin');
const Autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PostcssImport = require('postcss-import');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

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
    'main':      './src/main.ts'
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    modules: [helpers.root('src'), helpers.root('node_modules')]
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.ts$/,
        loader: 'tslint-loader',
        exclude: [/\.(spec|e2e)\.ts$/, /node_modules/]
      },
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
    new AssetsPlugin({
      path: helpers.root('dist'),
      filename: 'webpack-assets.json',
      prettyPrint: true
    }),
    new CheckerPlugin(),
    /*
     * Plugin: CommonsChunkPlugin
     * Description: Shares common code between the pages.
     * It identifies common modules and put them into a commons chunk.
     *
     * See: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
     * See: https://github.com/webpack/docs/wiki/optimization#multi-page-app
     */
    new CommonsChunkPlugin({
      name: 'polyfills',
      chunks: ['polyfills']
    }),
    // This enables tree shaking of the vendor modules
    new CommonsChunkPlugin({
      name: 'vendor',
      chunks: ['main'],
      minChunks: module => /node_modules\//.test(module.resource)
    }),
    // Specify the correct order the scripts will be injected in
    new CommonsChunkPlugin({
      name: ['polyfills', 'vendor'].reverse()
    }),
    /*
     * Plugin: HtmlWebpackPlugin
     * Description: Simplifies creation of HTML files to serve your webpack bundles.
     * This is especially useful for webpack bundles that include a hash in the filename
     * which changes every compilation.
     *
     * See: https://github.com/ampedandwired/html-webpack-plugin
     */
     // Workaround for angular/angular#11580
    new ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      helpers.root('./src'), // location of your src
      {} // a map of your routes
    ),
    new CopyWebpackPlugin([
      { from: 'src/meta'}
    ]),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      title: METADATA.title,
      metadata: METADATA,
      inject: 'head',
      hash: true
    }),
    /**
     * Plugin LoaderOptionsPlugin (experimental)
     *
     * See: https://gist.github.com/sokra/27b24881210b56bbaff7
     */
    new LoaderOptionsPlugin({
        debug: true,
        options: {
            tslint: {
              emitErrors: false,
              failOnHint: false,
              resourcePath: helpers.root('./src'),
              formattersDirectory: './node_modules/tslint-loader/formatters/'
            },
            postcss: [
              PostcssImport(),
              Autoprefixer({ browsers: ['last 5 versions'] })
            ]
        }
    }),
    /*
     * Plugin: ScriptExtHtmlWebpackPlugin
     * Description: Enhances html-webpack-plugin functionality
     * with different deployment options for your scripts including:
     *
     * See: https://github.com/numical/script-ext-html-webpack-plugin
     */
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer'
    })
  ],
  node: {
    global: true,
    crypto: 'empty',
    process: true,
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
};
