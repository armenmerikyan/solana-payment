const path = require('path');

module.exports = {
  entry: './src/app.js',  // Ensure this points to your entry file (app.js)
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    fallback: {
      "buffer": require.resolve("buffer/"),  // Polyfill Buffer for the browser
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',  // Optional: if you're using Babel for transpilation
        },
      },
    ],
  },
  devtool: 'source-map',  // Optional: Generates source maps for debugging
};
