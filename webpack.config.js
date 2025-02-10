const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"), // Output files to the root dist directory
        publicPath: "/solana_payment/", // Serve assets under /solana_payment/
        clean: true, // Clean old files
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            publicPath: "/solana_payment/", // Set the base path for assets in HTML
        }),
    ],
    resolve: {
        fallback: {
            buffer: require.resolve("buffer/"),
        },
    },
    mode: process.env.NODE_ENV === "production" ? "production" : "development",
    devServer: {
        static: {
            directory: path.join(__dirname, "dist"), // Serve static files from the dist directory
            publicPath: "/solana_payment/", // Ensure assets are served from /solana_payment/
        },
        historyApiFallback: {
            index: "/solana_payment/index.html", // Handle SPA routing for the subdirectory
        },
        allowedHosts: "all", // Allow any host
        port: 8080,
        open: true,
        hot: false, // Disable hot reloading to fix WebSocket issue
        liveReload: false, // Disable live reload to fix WebSocket issue
    },
};
