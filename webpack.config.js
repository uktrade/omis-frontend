const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WebpackAssetsManifest = require('webpack-assets-manifest')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')

const config = require('./config')

module.exports = {
  target: 'node',
  devtool: config.isProd ? false : 'source-map',
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
    new WebpackAssetsManifest({ output: 'manifest.json' }),
  ],
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src'),
    ],
    fallback: {
      path: false,
      fs: false,
      child_process: false,
      module: false,
      net: false,
      tls: false,
      process: false,
      os: false,
      http: false,
      https: false,
      stream: false,
      zlib: false,
    },
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
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.(png|svg|jpe?g|ico)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[hash:8].[ext]',
        },
        use: [{ loader: 'image-webpack-loader' }],
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
}
