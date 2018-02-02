var path = require("path"),
    base = require("./webpack.config.base.js");

module.exports = (outputPath) => {
    return base("source-map", [path.join(__dirname, "node_modules/disposables")], "production", outputPath);
}