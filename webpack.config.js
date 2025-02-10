const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "/solana_payment/", // 👈 Set the base path for assets
        clean: true, // Ensure old files are removed
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            publicPath: "/solana_payment/", // 👈 Set the base path for assets
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
            directory: path.join(__dirname, "dist"),
            publicPath: "/solana_payment/", // Serve from subdirectory
        },
        historyApiFallback: {
            index: "/solana_payment/index.html", // Ensure SPA routing works
        },
        allowedHosts: "all", // Allow any host
        port: 8080,
        open: true,
        hot: false, // Disable Webpack hot reloading (fix WebSocket issue)
        liveReload: false, // Disable live reload (fix WebSocket issue)
    },    
};
