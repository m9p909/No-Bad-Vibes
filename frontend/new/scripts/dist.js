// Build in production mode.
process.env.NODE_ENV = "production";

var webpack = require("webpack"),
  config = require("./webpack.config");

delete config.chromeExtensionBoilerplate;

webpack(config, function (err) {
  if (err) throw err;
});
