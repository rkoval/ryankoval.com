const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const src = dir => path.join(__dirname, 'src', dir)

const isProduction = process.env.NODE_ENV === 'production'

const extractLess = new ExtractTextPlugin({
  filename: '[name].[contenthash].css',
  disable: !isProduction,
})

module.exports = {
  entry: {
    app: './src/app.js',
    vendor: './src/vendor.js',
  },
  output: {
    path: src('../dist'),
    filename: '[name].[hash].js',
  },
  devtool: !isProduction ? '#cheap-module-eval-source-map' : false,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: ['babel-loader'],
      },
      {
        test: /\.(css|less)$/,
        use: extractLess.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: isProduction,
                sourceMap: !isProduction,
              },
            },
            {
              loader: 'less-loader',
            },
          ],
          fallback: 'style-loader',
        }),
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader',
      },
      {
        test: /\.(ttf|eot|woff|woff2|svg)(\?\S*)?$/,
        loader: 'url-loader',
        include: [src('../node_modules/font-awesome/fonts'), src('fonts')],
        options: {
          limit: 8192,
          name: 'fonts/[name].[ext]',
        },
      },
      {
        test: /\.(svg|png|gif|jpe?g)$/,
        loader: 'url-loader',
        include: [src('images')],
        options: {
          name: 'images/[name].[ext]',
        },
      },
    ],
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new OptimizeCssAssetsPlugin({
      cssProcessorOptions: {
        safe: true,
      },
    }),
    new webpack.DefinePlugin({
      PRODUCTION: isProduction,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
    }),
    new UglifyJsPlugin({
      parallel: 4,
      sourceMap: !isProduction,
    }),
    new HtmlWebpackPlugin({
      title: 'index.html',
      template: src('../template-preparer.js'),
    }),
    new CopyWebpackPlugin([
      {
        from: src('../static'),
      },
    ]),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      WOW: 'wowjs',
    }),
    // uncomment to inspect generated bundle
    // new BundleAnalyzerPlugin(),
    extractLess,
  ],
}
