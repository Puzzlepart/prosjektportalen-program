'use strict';
var gulp = require("gulp"),
    path = require("path"),
    webpack = require('webpack'),
    wpDev = require('../src/webpack.config.development.js'),
    wpProd = require('../src/webpack.config.production.js'),
    pluginError = require('plugin-error'),
    autoprefixer = require('autoprefixer-stylus'),
    stylus = require('gulp-stylus'),
    powershell = require("./utils/powershell.js"),
    settings = require('./@settings.js'),
    config = require('./@configuration.js');

gulp.task("packageStyles", (done) => {
    return gulp.src(config.paths.stylesMain)
        .pipe(stylus({ compress: false, use: [autoprefixer('last 5 versions')] }))
        .pipe(gulp.dest(config.paths.dist));
});

gulp.task("packageStylesTemplate", (done) => {
    return gulp.src(config.paths.stylesMain)
        .pipe(stylus({ compress: false, use: [autoprefixer('last 5 versions')] }))
        .pipe(gulp.dest(path.join(config.paths.rootTemplate, "SiteAssets")));
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
    webpack(wpProd(path.join(__dirname, "../templates/root/SiteAssets/js")), (err, stats) => {
        if (err) throw new pluginError("packageCodeTemplate", err);
        done();
    });
});

gulp.task("packagePnpTemplates", ["packageCodeTemplate", "packageStylesTemplate"], (done) => {
    powershell.execute("Generate-PnP-Files.ps1", "", done);
});