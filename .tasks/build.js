'use strict';
var gulp = require("gulp"),
    path = require("path"),
    log = require('fancy-log'),
    es = require('event-stream'),
    flatmap = require("gulp-flatmap"),
    replace = require('gulp-replace'),
    format = require("string-format"),
    typescript = require("gulp-typescript"),
    configuration = require('./@configuration.js'),
    merge = require("merge2"),
    git = require("./utils/git.js"),
    pkg = require("../package.json");

gulp.task("copyPnpTemplates", () => {
    return gulp.src(configuration.PATHS.TEMPLATES_GLOB)
        .pipe(gulp.dest(configuration.PATHS.TEMPLATES_TEMP));
});

function replaceVersionToken(stream, gitHash, dest) {
    return stream
        .pipe(replace(configuration.VERSION_REPLACE_TOKEN, format("{0}.{1}", pkg.version, gitHash)))
        .pipe(gulp.dest(dest))
}

gulp.task("stampVersionToTemplates", done => {
    git.hash(gitHash => {
        es.concat(gulp.src([
            path.join(configuration.PATHS.TEMPLATES_TEMP, "/**/*.xml"),
            path.join(configuration.PATHS.TEMPLATES_TEMP, "/*.xml")
        ]).pipe(flatmap((stream, file) => replaceVersionToken(stream, gitHash, configuration.PATHS.TEMPLATES_TEMP)))).on('end', done);
    });
});

gulp.task("stampVersionToDist", cb => {
    git.hash(gitHash => {
        es.concat(gulp.src(path.join(configuration.PATHS.DIST, "/*.ps1")).pipe(flatmap((stream, file) => replaceVersionToken(stream, gitHash, configuration.PATHS.DIST)))).on('end', cb);
    });
});

gulp.task("buildLib", () => {
    var project = typescript.createProject("src/tsconfig.json", { declaration: true });
    var built = gulp.src(configuration.PATHS.SOURCE_GLOB).pipe(project(typescript.reporter.fullReporter()));
    return merge([
        built.dts.pipe(gulp.dest(configuration.PATHS.LIB)),
        built.js.pipe(gulp.dest(configuration.PATHS.LIB))
    ]);
});