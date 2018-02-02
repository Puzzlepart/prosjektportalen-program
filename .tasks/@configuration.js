'use strict';
var path = require("path");

module.exports = {
    paths: {
        dist: path.join(__dirname, "../dist"),
        lib: path.join(__dirname, "../lib"),
        source: "./src",
        sourceGlob: "./src/**/*.ts*",
        stylesGlob: "./src/**/*.styl",
        stylesMain: ["./src/*/pp.program.styl"],
        libGlob: ["./lib/**/*.js", "./lib/**/**/*.js"],
        scripts: "./.scripts",
        release: "./release",
        buildGlob: "./build/**/*",
        rootTemplate: path.join(__dirname, "../templates/root"),
    },
    useBundleAnalyzer: false,
}