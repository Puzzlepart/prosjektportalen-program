'use strict';
var gulp = require("gulp"),
    typescript = require("gulp-typescript"),
    configuration = require('./@configuration.js'),
    merge = require("merge2"),
    pkg = require("../package.json");

gulp.task("buildLib", () => {
    var project = typescript.createProject("src/tsconfig.json", { declaration: true });
    var built = gulp.src(configuration.PATHS.SOURCE_GLOB).pipe(project(typescript.reporter.fullReporter()));
    return merge([
        built.dts.pipe(gulp.dest(configuration.PATHS.LIB)),
        built.js.pipe(gulp.dest(configuration.PATHS.LIB))
    ]);
});