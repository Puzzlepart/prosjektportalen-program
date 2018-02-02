var path = require("path"),
    base = require("./webpack.config.base.js");

module.exports = (devtool = "source-map") => {
    return base("source-map", [path.join(__dirname, "node_modules")], "development");
}