const path = require("path");

module.exports = {
  entry: {
    app: ["./index.js"]
  },
  mode: 'development',
  output: {
    path: path.resolve(__dirname, "build"),
    //publicPath: "/assets/",
    filename: "out.js"
  }
};
