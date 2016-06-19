// webpack.config.js

var path = require("path");
module.exports = {
  entry: {
    './client/background/bundle': './client/background/init.js',
    './client/lib/content_script_bundle': './client/lib/content_script.js'
  },
  output: {
    path: path.join(__dirname, ''),
    filename: '[name].js',
    chunkFilename: './build/core/[name].js'
  },
  module: {
    loaders: [
      { test: /\.coffee$/, loader: 'coffee-loader' },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react', 'stage-3']
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.xtpl$/,
        exclude: /node_modules/,
        loader: 'xtpl',
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css']
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.coffee']
  }
};
