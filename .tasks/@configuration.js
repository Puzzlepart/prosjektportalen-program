'use strict';
var path = require("path"),
    autoPrefixerStylus = require('autoprefixer-stylus');

module.exports = {
    PATHS: {
        DIST: path.join(__dirname, "../dist"),
        LIB: path.join(__dirname, "../lib"),
        LIBG_LOB: ["./lib/**/*.js", "./lib/**/**/*.js"],
        SOURCE: "./src",
        SOURCE_GLOB: "./src/**/*.ts*",
        STYLES_GLOB: "./src/**/*.styl",
        STYLES_MAIN: ["./src/*/pp.program.styl"],
        SCRIPTS: "./.scripts",
        RELEASE: "./release",
        BUILD_GLOB: "./build/**/*",
        TEMPLATES: "./templates",
        TEMPLATES_TEMP: "./_templates",
        TEMPLATES_GLOB: "./templates/**/*",
        ROOT_TEMPLATE: path.join(__dirname, "../_templates/root"),
        ASSETS_TEMPLATE: path.join(__dirname, "../_templates/assets"),
        CONFIG_TEMPLATE: path.join(__dirname, "../_templates/config"),
    },
    USE_BUNDLE_ANALYZER: false,
    JS: {
        POLYFILLS: [            
            'core-js/es6/map',
            'core-js/es6/set',
            'core-js/fn/object/assign',
            'core-js/es6/promise',
            'whatwg-fetch',
            'regenerator-runtime/runtime',
        ],
    },
    STYLUS: {
        compress: false,
        use: [autoPrefixerStylus('last 5 versions')],
    },
    VERSION_REPLACE_TOKEN: "{package-version}"
}
