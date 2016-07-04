// webpack.config.js

var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: {
    './client/background/bundle': './client/background/init.js',
    './client/lib/content_script_bundle': './client/lib/content_script.js',
    './client/popup/popup_bundle': './client/popup/popup.js'
  },
  output: {
    path: path.join(__dirname, ''),
    filename: '[name].js',
    chunkFilename: './build/core/[name].js'
  },
  module: {
    loaders: [{
        test: /\.coffee$/,
        loader: 'coffee-loader'
      }, {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react', 'stage-3']
        }
      }, {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.xtpl$/,
        exclude: /node_modules/,
        loader: 'xtpl',
      },
      // Optionally extract less files
      // or any other compile-to-css language
      {
        test: /\.less$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract("css-loader!less-loader")
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.coffee','.less']
  },
  plugins: [
    new ExtractTextPlugin("[name]_style.css")
  ]
};
