const path = require('path');

module.exports = {
  entry: './src/app.js', // Your entry file
  output: {
    filename: 'bundle.js', // Output file name
    path: path.resolve(__dirname, 'dist'), // Output directory
  },
  resolve: {
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "http": require.resolve("stream-http"),
      "fs": require.resolve("browserify-fs"),
      "url": require.resolve("url"),
      "stream": require.resolve("stream-browserify"),
      "querystring": require.resolve("querystring-es3"),
      "string_decoder": require.resolve("string_decoder")
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
