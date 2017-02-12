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
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PostcssImport = require('postcss-import');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

const helpers = require('./helpers');

const mainCss = [
  'css-loader',
  helpers.root('src','styles.css')
];
//mainCss.unshift('style-loader');
 mainCss.unshift('file-loader?name=[name].[ext]', 'extract-loader');
//console.log(mainCss.join('!'));
//process.exit();
const METADATA = {
  title: 'Angular2 Webpack2',
  baseUrl: '/',
  isDevServer: helpers.isWebpackDevServer()
};
module.exports = {
  devtool: 'cheap-module-source-map',
  entry: {
    'polyfills': './src/polyfills.ts',
    'main':      './src/main.ts'/*,
    'mainstyles': mainCss.join('!')*/
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
        use: [
          { loader: 'tslint-loader'}
        ],
        exclude: [
          /node_modules/,
          /\.(spec|e2e)\.ts$/
        ]
      },
      {
        test: /\.ts$/,
        use: [
          { loader: 'awesome-typescript-loader'}
        ],
        exclude: [/\.(spec|e2e)\.ts$/]
      },
      {
        test: /\.ts$/,
        use: [
          { loader: 'angular2-template-loader'}
        ],
        exclude: [/\.(spec|e2e)\.ts$/]
      },
      {
        test: /\.ts$/,
        use: [
          { loader: 'ng-router-loader'}
        ],
        exclude: [/\.(spec|e2e)\.ts$/]
      },
      {
        test: /\.css$/,
        exclude: [helpers.root('src', 'app')],
        use: ExtractTextPlugin
          .extract({
            fallback: 'style-loader',
            use: [
              { loader: 'css-loader', query: { modules: false, sourceMaps: true } },
              {loader: 'postcss-loader'}
            ]
          })
      },
      {
        test: /\.css$/,
        include: [helpers.root('src', 'app')],
        use: [
          { loader: 'raw-loader'},
          {loader: 'postcss-loader'}
        ]
      },
      {
        test: /\.scss$/,
        exclude: [helpers.root('src', 'app')],
        use: ExtractTextPlugin
          .extract({
            fallback: 'style-loader',
            use: [
              { loader: 'css-loader', query: { modules: false, sourceMaps: true } },
              {loader: 'postcss-loader'},
              { loader: 'sass-loader', query: { sourceMaps: true }}
            ]
          })
      },
      {
        test: /\.scss$/,
        include: [helpers.root('src', 'app')],
        use: [
          { loader: 'raw-loader'},
          { loader: 'sass-loader',query: { sourceMaps: true }},
          { loader: 'postcss-loader'}
        ]
      },
      {
        test: /\.json$/,
        use: [
          { loader: 'json-loader'}
        ]
      },
      {
        test: /\.html$/,
        use: [
          { loader:'raw-loader'}
        ],
        exclude: [helpers.root('src/index.html')]
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: { limit: 10000 }
          }
        ]
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'url-loader',
            options: { limit: 10000, mimetype: 'application/font-woff' }
          }
        ]
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'file-loader'
      }
    ]
  },
  plugins: [
    new AssetsPlugin({
      path: helpers.root('dist'),
      filename: 'webpack-assets.json',
      prettyPrint: true
    }),
    /*
     * Plugin: ForkCheckerPlugin
     * Description: Do type checking in a separate process, so webpack don't need to wait.
     *
     * See: https://github.com/s-panferov/awesome-typescript-loader#forkchecker-boolean-defaultfalse
     */
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
      { from: 'src/meta', to: ''}
    ]),
    new FaviconsWebpackPlugin({
      logo: helpers.root('src', 'assets', 'img', 'logo.png'),
      inject: true
    }),
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
            }
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
    }),
    new WebpackNotifierPlugin({
      title: METADATA.title,
      contentImage: helpers.root('src', 'assets', 'img', 'logo.png')
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
