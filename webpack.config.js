const path = require('path');

module.exports = {
  entry: './src/app.js', // Your entry file
  output: {
    filename: 'bundle.js', // Output file name
    path: path.resolve(__dirname, 'public/dist'), // Output directory inside 'public'
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
      "net": false, // Exclude `net` module
      "zlib": require.resolve("browserify-zlib"), // Polyfill for `zlib`
      "async_hooks": false, // Exclude `async_hooks`
      "vm": require.resolve("vm-browserify"), // Polyfill for `vm`
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Transpile JavaScript files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Use Babel for transpiling
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  mode: 'development', // Set to 'production' for production builds
  devtool: 'source-map', // Enable source maps for debugging
};
