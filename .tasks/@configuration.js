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
        templates: "./templates",
        templates_temp: "./_templates",
        templatesGlob: "./templates/**/*",
        rootTemplate: path.join(__dirname, "../templates/root"),
    },
    useBundleAnalyzer: false,
    js: {
        polyfills: [
            'core-js/fn/object/assign',
            'core-js/es6/promise',
            'whatwg-fetch',
            'regenerator-runtime/runtime',
        ],
    }
}
