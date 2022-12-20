const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");

const srcPath = path.resolve(__dirname, "src");
const buildPath = path.resolve(__dirname, "build");
const cssRegexp = /.css$/i;
const lessRegexp = /.less$/i;
const cssModuleRegexp = /.module.css$/i;
const lessModuleRegexp = /.module.less$/i;

const isProd = process.env.NODE_ENV === "production";
console.log("NODE_ENV", process.env.NODE_ENV);

function getLocalIdentName() {
  return isProd
    ? "[local]_[hash:base64:8]"
    : "[path][name]_[local]_[hash:base64:8]";
}

module.exports = function (...args) {
  return {
    mode: isProd ? "production" : "development",
    entry: path.join(srcPath, "index.js"),
    output: {
      path: buildPath,
      filename: isProd
        ? "static/js/[name].[contenthash:8].js"
        : "static/js/bundle.js",
      chunkFilename: "static/js/[name].[contenthash:8].chunk.js",
      publicPath: isProd ? "/build/" : "/",
    },
    devServer: {
      static: {
        directory: path.join(__dirname, "./public"),
      },
      port: 9000,
      hot: true,
    },
    resolve: {
      alias: {
        "@": srcPath,
      },
    },
    optimization: {
      minimize: isProd,
      minimizer: [
        new TerserPlugin({}),
        // https://www.npmjs.com/package/css-minimizer-webpack-plugin
        new CssMinimizerPlugin(),
      ],
    },
    module: {
      rules: [
        {
          oneOf: [
            {
              test: /.js$/i,
              exclude: /node_modules/,
              use: [
                "thread-loader",
                {
                  loader: "babel-loader",
                  options: {
                    cacheDirectory: true,
                    presets: ["babel-preset-react-app"],
                    plugins: [
                      !isProd && require.resolve("react-refresh/babel"),
                    ].filter(Boolean),
                  },
                },
              ],
            },
            {
              test: cssRegexp,
              exclude: cssModuleRegexp,
              use: [
                isProd ? MiniCssExtractPlugin.loader : "style-loader",
                "css-loader",
              ],
            },
            {
              test: cssModuleRegexp,
              use: [
                isProd ? MiniCssExtractPlugin.loader : "style-loader",
                {
                  loader: "css-loader",
                  options: {
                    modules: {
                      localIdentName: getLocalIdentName(),
                    },
                  },
                },
              ],
            },
            {
              test: lessRegexp,
              exclude: lessModuleRegexp,
              use: [
                isProd ? MiniCssExtractPlugin.loader : "style-loader",
                "css-loader",
                "less-loader",
              ],
            },
            {
              test: lessModuleRegexp,
              use: [
                isProd ? MiniCssExtractPlugin.loader : "style-loader",
                {
                  loader: "css-loader",
                  options: {
                    modules: {
                      localIdentName: getLocalIdentName(),
                    },
                  },
                },
                "less-loader",
              ],
            },
            {
              test: /\.(png|jpg|gif)$/i,
              use: [
                {
                  loader: "url-loader",
                  options: {
                    limit: 8192,
                  },
                },
              ],
            },
            {
              test: /\.(woff|woff2|eot|ttf|otf)$/i,
              loader: "file-loader",
              options: {},
            },
          ],
        },
      ],
    },
    plugins: [
      // https://www.npmjs.com/package/html-webpack-plugin
      new HtmlWebpackPlugin({
        minify: isProd,
        template: path.join(__dirname, "./public/index.html"),
      }),
      // https://www.npmjs.com/package/clean-webpack-plugin
      new CleanWebpackPlugin({
        verbose: true,
      }),
      // https://www.npmjs.com/package/@pmmmwh/react-refresh-webpack-plugin
      !isProd && new ReactRefreshWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: "static/css/[name].[contenthash:8].css",
        chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
      }),
      new webpack.DefinePlugin({
        __DEV__: isProd ? "false" : "true",
      }),
      new ProgressBarPlugin(),
    ].filter(Boolean),
  };
};
