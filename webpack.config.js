const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    content: "./scripts/content.js",
    background: "./scripts/background.js"
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: "images/icon[0-9]*.png" },
      { from: "manifest.json" }
    ])
  ]
};
