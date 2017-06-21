const path = require("path");
const BabiliPlugin = require("babili-webpack-plugin");

module.exports = {
  entry: {
    app: ["./index.js"]
  },
  output: {
    path: path.resolve(__dirname, "build"),
    //publicPath: "/assets/",
    filename: "out.js"
  },
  plugins: [
    new BabiliPlugin()
  ]
};
