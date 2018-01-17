const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const ReloadPlugin = require('reload-html-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const src = dir => path.join(__dirname, 'src', dir)

const isProduction = process.env.NODE_ENV === 'production'

const extractLess = new ExtractTextPlugin({
  filename: '[name].[contenthash].css',
  disable: !isProduction,
})

const styleLoaders = (() => {
  if (isProduction) {
    return {
      test: /\.(css|less)$/,
      use: extractLess.extract({
        use: [
          {
            loader: 'css-loader',
            options: {
              minimize: true,
            },
          },
          {
            loader: 'less-loader',
          },
        ],
        fallback: 'style-loader',
      }),
    }
  }

  return {
    test: /\.(css|less)$/,
    use: [
      {
        loader: 'style-loader',
      },
      {
        loader: 'css-loader',
      },
      {
        loader: 'less-loader',
      },
    ],
  }
})()

const config = {
  entry: {
    vendor: './src/vendor.js',
    app: './src/app.js',
    resume: './src/resume.js',
  },
  output: {
    path: src('../dist'),
    filename: isProduction ? '[name].[hash].js' : '[name].js',
  },
  devtool: !isProduction ? '#cheap-module-eval-source-map' : false,
  devServer: {
    hot: true,
    overlay: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: ['babel-loader'],
      },
      styleLoaders,
      {
        test: /\.pug$/,
        include: /(src\/views)/,
        loader: 'pug-loader',
      },
      {
        test: /\.(ttf|eot|woff|woff2|svg)(\?\S*)?$/,
        loader: 'url-loader',
        include: [src('fonts')],
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
      {
        test: /\.ya?ml$/,
        include: [src('')],
        use: ['json-loader', 'yaml-loader'],
      },
    ],
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      PRODUCTION: isProduction,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      chunks: ['app'],
      minChunks: Infinity,
    }),
    new HtmlWebpackPlugin({
      chunks: ['app', 'vendor'],
      template: src('../template-preparer.js'),
      filename: 'index.html',
    }),
    new HtmlWebpackPlugin({
      chunks: ['resume'],
      template: src('../resume-preparer.js'),
      filename: 'resume.html',
    }),
    new CopyWebpackPlugin([
      {
        from: src('../static'),
      },
    ]),
    new webpack.NamedModulesPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      WOW: 'wowjs',
    }),
  ],
}

if (!isProduction) {
  config.plugins.push(
    new ReloadPlugin()
    // uncomment to inspect generated bundle
    // new BundleAnalyzerPlugin()
  )
} else {
  config.plugins.push(
    new OptimizeCssAssetsPlugin({
      cssProcessorOptions: {
        safe: true,
      },
    }),
    new UglifyJsPlugin({
      parallel: 4,
      sourceMap: true,
    }),
    extractLess
  )
}

module.exports = config
