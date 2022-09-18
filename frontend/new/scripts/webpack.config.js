var webpack = require("webpack"),
  path = require("path"),
  fileSystem = require("fs"),
  CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin,
  CopyWebpackPlugin = require("copy-webpack-plugin"),
  HtmlWebpackPlugin = require("html-webpack-plugin");

const { env } = process;
env.NODE_ENV = env.NODE_ENV || "development";

const isDev = env.NODE_ENV === "development";
const basePath = path.join(__dirname, "..");

// load the secrets
var alias = {};

var secretsPath = path.join(basePath, "secrets." + env.NODE_ENV + ".js");

var resourceFileExtensions = ["png"];

if (fileSystem.existsSync(secretsPath)) {
  alias["secrets"] = secretsPath;
}

var options = {
  mode: env.NODE_ENV,
  entry: {
    popup: [path.join(basePath, "src", "js", "popup", "index.js")],
    options: [path.join(basePath, "src", "js", "options.js")],
    background: [path.join(basePath, "src", "js", "background", "index.js")],
    "background-wrapper": path.join(
      basePath,
      "compat",
      "background-wrapper.js"
    ),
  },
  output: {
    path: path.join(basePath, isDev ? "build" : "dist"),
    filename: "[name].bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
        sideEffects: true,
        exclude: /node_modules/,
      },
      {
        test: new RegExp(".(" + resourceFileExtensions.join("|") + ")$"),
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
        },
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        loader: "html-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    alias: alias,
  },
  plugins: [
    // clean the build folder
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
    // expose and write the allowed env vars on the compiled bundle
    new webpack.EnvironmentPlugin({ NODE_ENV: JSON.stringify(env.NODE_ENV) }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "src/manifest.json",
          transform: function (content) {
            // generates the manifest file using the package.json information
            return Buffer.from(
              JSON.stringify(
                {
                  description: process.env.npm_package_description,
                  version: process.env.npm_package_version,
                  ...JSON.parse(content.toString()),
                },
                null,
                isDev ? 2 : null
              )
            );
          },
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: path.join(basePath, "src", "popup.html"),
      filename: "popup.html",
      chunks: ["popup"],
    }),
    new HtmlWebpackPlugin({
      template: path.join(basePath, "src", "options.html"),
      filename: "options.html",
      chunks: ["options"],
    }),
  ],
};

if (env.NODE_ENV === "development") {
  options.devtool = "cheap-module-source-map";
}

module.exports = options;
