'use strict';
var gulp = require("gulp"),
    path = require("path"),
    webpack = require('webpack'),
    wpDev = require('../webpack.config.development.js'),
    wpProd = require('../webpack.config.production.js'),
    pluginError = require('plugin-error'),
    stylus = require('gulp-stylus'),
    powershell = require("./utils/powershell.js"),
    settings = require('./@settings.js'),
    configuration = require('./@configuration.js');

gulp.task("packageStyles", (done) => {
    return gulp.src(configuration.PATHS.STYLES_MAIN)
        .pipe(stylus(configuration.STYLUS))
        .pipe(gulp.dest(configuration.PATHS.DIST));
});

gulp.task("packageStylesTemplate", (done) => {
    return gulp.src(configuration.PATHS.STYLES_MAIN)
        .pipe(stylus(configuration.STYLUS))
        .pipe(gulp.dest(path.join(configuration.PATHS.ASSETS_TEMPLATE, "SiteAssets")));
});

gulp.task("packageCode", ["buildLib"], (done) => {
    webpack(wpDev("source-map"), (err, stats) => {
        if (err) throw new pluginError("packageCode", err);
        done();
    });
});

gulp.task("packageCodeMinify", ["buildLib"], (done) => {
    webpack(wpProd(), (err, stats) => {
        if (err) throw new pluginError("packageCodeMinify", err);
        done();
    });
});

gulp.task("packageCodeTemplate", ["buildLib"], (done) => {
    webpack(wpProd(path.join(configuration.PATHS.ASSETS_TEMPLATE, "SiteAssets/js")), (err, stats) => {
        if (err) throw new pluginError("packageCodeTemplate", err);
        done();
    });
});

gulp.task("packagePnpTemplates", ["packageCodeTemplate", "packageStylesTemplate"], (done) => {
    powershell.execute("Generate-PnP-Files.ps1", "", done);
});