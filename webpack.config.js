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
    devServer: {
        static: {
            directory: path.join(__dirname, "dist"), // Serve files from the "dist" folder
        },
        allowedHosts: [
            "gigahard.ai", // Allow requests from this host
            "localhost",   // Allow requests from localhost
        ],
        port: 8080, // Port to run the dev server
        open: true, // Open the browser automatically
    },
};