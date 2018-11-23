const path = require("path");

module.exports = {
  entry: {
    app: ["./index.js"]
  },
  output: {
    path: path.resolve(__dirname, "dist/web"),
    //publicPath: "/assets/",
    filename: "out.js"
  }
};
