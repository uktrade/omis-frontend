const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WebpackAssetsManifest = require('webpack-assets-manifest')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')

const config = require('./config')

module.exports = {
  target: 'node',
  devtool: config.isProd ? 'false' : 'source-map',
  mode: config.isProd ? 'production' : 'development',
  entry: {
    styles: './assets/stylesheets/app.scss',
    'styles.print': './assets/stylesheets/app.print.scss',
    app: [
      './assets/javascripts/vendor/details.polyfill.js',
      './assets/javascripts/app.js',
    ],
  },
  output: {
    path: config.buildDir,
    publicPath: '/',
    filename: config.isProd ? 'js/[name].[chunkhash:8].js' : 'js/[name].js',
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: config.isProd
        ? 'css/[name].[contenthash:8].css'
        : 'css/[name].css',
      chunkFilename: 'css/[name].[id].css',
    }),
    new BrowserSyncPlugin({
      port: 3001,
      proxy: `http://localhost:${config.server.port}`,
      open: false,
      files: [
        '.build/css/*.css',
        '.build/js/*.js',
        '.build/images/*',
        'src/**/*.njk',
      ],
    }, {
      reload: false,
    }),
    new WebpackAssetsManifest(),
  ],
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src'),
    ],
    extensions: ['*', '.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: '/node_modules/',
        options: {
          cacheDirectory: './babel_cache',
        },
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'file-loader?name=fonts/[name].[hash:8].[ext]',
      },
      {
        test: /\.(png|svg|jpe?g|ico)$/,
        loader: [
          'file-loader?name=images/[name].[hash:8].[ext]',
          'image-webpack-loader',
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: config.isDev,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: config.isDev,
            },
          },
          'resolve-url-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true, // required for resolve-url-loader
              sassOptions: {
                includePaths: [
                  path.resolve(__dirname, 'node_modules/govuk_frontend_toolkit/stylesheets'),
                ],
              },
            },
          },
        ],
      },
    ],
  },
  node: {
    fs: 'empty',
    child_process: 'empty',
    module: 'empty',
    net: 'empty',
    tls: 'empty',
  },
}
