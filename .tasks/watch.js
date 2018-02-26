'use strict';
var gulp = require("gulp"),
    plumber = require("gulp-plumber"),
    format = require("string-format"),
    watch = require("gulp-watch"),
    spsave = require("gulp-spsave"),
    runSequence = require("run-sequence"),
    livereload = require('gulp-livereload'),
    configuration = require('./@configuration.js'),
    defaultSettings = require('./@settings.js');

let buildTimeout;

function __startWatch(packageCodeFunc) {   
    const argv = require('yargs').argv;
    livereload.listen({ start: true });
    const settings = {
        siteUrl: argv.siteUrl || defaultSettings.siteUrl,
        username: argv.username || defaultSettings.username,
        password: argv.password || defaultSettings.password,
    };
    runSequence("clean", packageCodeFunc, "packageStyles", () => {
        uploadFile(format("{0}/js/*.js", configuration.PATHS.DIST), settings.siteUrl, "siteassets/pp/js", settings);
        uploadFile(format("{0}/css/*.css", configuration.PATHS.DIST), settings.siteUrl, "siteassets/pp/css", settings);
    });
    watch(configuration.PATHS.SOURCE_GLOB).on("change", () => {
        if (buildTimeout) {
            clearTimeout(buildTimeout);
        }
        buildTimeout = setTimeout(() => {
            runSequence("clean", packageCodeFunc, () => {
                uploadFile(format("{0}/js/*.js", configuration.PATHS.DIST), settings.siteUrl, "siteassets/pp/js", settings);
            });
        }, 100);
    });
    watch(configuration.PATHS.STYLES_GLOB).on("change", () => {
        runSequence("packageStyles", () => {
            uploadFile(format("{0}/css/*.css", configuration.PATHS.DIST), settings.siteUrl, "siteassets/pp/css", settings);
        });
    });
}

gulp.task("watch", () => {
    __startWatch("packageCode");
});

gulp.task("watchProd", () => {
    __startWatch("packageCodeMinify");
});

function uploadFile(glob, url, folder, settings) {
    gulp.src(glob)
        .pipe(plumber({
            errorHandler: function (err) {
                this.emit("end");
            }
        }))
        .pipe(spsave({ folder: folder, siteUrl: url }, { username: settings.username, password: settings.password }))
        .pipe(livereload());
}