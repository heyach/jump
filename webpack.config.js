// @ts-nocheck
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const webpackConfig = {
    entry: {
        main: path.join(__dirname, "./src/main"),
    },
    devtool: "#source-map",
    output: {
        publicPath: "/",
        filename: "js/[name].[hash:8].js",
    },
    resolve: {
      // 先尝试 ts，tsx 后缀的 TypeScript 源码文件
      extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /node_modules/,
            },
            {
              test: /\.ts$/,
              loader: 'awesome-typescript-loader'
            }
        ],
    },
    devServer: {
        port: 8889,
        contentBase: path.join(__dirname, "./src"),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "./src/index.html"),
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
};
module.exports = webpackConfig;
