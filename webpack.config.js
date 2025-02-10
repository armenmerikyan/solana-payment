const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.js", // Entry point for your application
    output: {
        filename: "bundle.js", // Output bundle file
        path: path.resolve(__dirname, "dist"), // Output directory
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html", // Use your HTML file as a template
        }),
    ],
    resolve: {
        fallback: {
            buffer: require.resolve("buffer/"), // Polyfill for Buffer
        },
    },
    mode: "development", // Set to "production" for optimized builds
};