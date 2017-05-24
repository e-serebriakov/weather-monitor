const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const env = process.env.NODE_ENV;
const isProd = process.env.NODE_ENV === 'prod';
const isDev = !isProd;

function getDevtool() {
  let devtool = 'source-map';
  if (isProd) {
    devtool = false;
  }
  return devtool;
}

function getPlugins() {
  const plugins = [
    new CleanWebpackPlugin(['public'], {
      root: __dirname,
      verbose: true,
      dry: false
    }),
    new webpack.DefinePlugin({
      WP_NODE_ENV: JSON.stringify(env),
      WP_IS_DEV: isDev,
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
  ];

  if (isProd) {
    plugins.push(
      new UglifyJSPlugin()
    );
  }

  return plugins;
}

module.exports = {
  context: __dirname + '/src',

  entry:  {
    index: './index.js',
  },

  output: {
    path: __dirname + '/public',
    filename: `[name].js`,
    publicPath: '/public/'
  },

  resolve: {
    alias: {
      'babel-polyfill':
        path.join(__dirname, 'node_modules/babel-polyfill/dist/polyfill.js'),
    }
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /\/node_modules\//
      },
      {
        test: /\.(jpg|jpeg|png|svg)$/,
        loader: `file-loader?name=images/[name].[hash:8].[ext]`
      },
      {
        test: /\.(woff|woff2|ttf)$/,
        loader: `file-loader?name=fonts/[name].[hash:8].[ext]`
      },
      {
        test: /\.json$/,
        use: 'json-loader'
      }
    ]
  },

  stats: {
    children: false
  },

  devtool: getDevtool(),

  plugins: getPlugins(),
};
