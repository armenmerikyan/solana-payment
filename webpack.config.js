const path = require('path');

module.exports = {
  entry: './src/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/dist'),
  },
  resolve: {
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "http": require.resolve("stream-http"),
      "fs": require.resolve("browserify-fs"),
      "url": require.resolve("url"),
      "stream": require.resolve("stream-browserify"),
      "querystring": require.resolve("querystring-es3"),
      "string_decoder": require.resolve("string_decoder"),
      "net": false,
      "zlib": require.resolve("browserify-zlib"),
      "async_hooks": false,
      "vm": require.resolve("vm-browserify"),
      "process": require.resolve("process/browser"), // Polyfill for process
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  mode: 'development',
  devtool: 'source-map',
};
