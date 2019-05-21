'use strict';
var gulp = require("gulp"),
    path = require("path"),
    zip = require("gulp-zip"),
    format = require("string-format"),
    runSequence = require("run-sequence"),
    git = require("./utils/git.js"),
    pkg = require("../package.json"),
    configuration = require('./@configuration.js');

gulp.task("copyBuild", () => {
    return gulp.src(configuration.PATHS.BUILD_GLOB)
        .pipe(gulp.dest(configuration.PATHS.DIST))
});

gulp.task("copyScripts", () => {
    return gulp.src(configuration.PATHS.SCRIPTS, { removeBOM: false })
        .pipe(gulp.dest(path.join(configuration.PATHS.DIST, "scripts")))
});

gulp.task("zipDist", (done) => {
    git.hash(hash => {
        gulp.src(format("{0}/**/*", configuration.PATHS.DIST))
            .pipe(zip(format("{0}-{1}.{2}.zip", pkg.name, pkg.version, hash)))
            .pipe(gulp.dest(configuration.PATHS.RELEASE))
            .on('end', () => done());
    });
});

gulp.task("release", (done) => {
    runSequence("copyPnpTemplates", "stampVersionToTemplates", "packagePnpTemplates", "copyBuild", "copyScripts", "stampVersionToDist", "zipDist", "clean", done);
});

gulp.task("release-dev", (done) => {
    runSequence("copyPnpTemplates", "stampVersionToTemplates", "packagePnpTemplatesDev", "copyBuild", "copyScripts", "stampVersionToDist", "zipDist", "clean", done);
});