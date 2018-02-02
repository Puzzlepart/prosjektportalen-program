'use strict';
var gulp = require("gulp"),
    typescript = require("gulp-typescript"),
    config = require('./@configuration.js'),
    merge = require("merge2"),
    pkg = require("../package.json");

gulp.task("buildLib", () => {
    var project = typescript.createProject("src/tsconfig.json", { declaration: true });
    var built = gulp.src(config.paths.sourceGlob)
            .pipe(project(typescript.reporter.fullReporter()));
    return merge([
        built.dts.pipe(gulp.dest(config.paths.lib)),
        built.js.pipe(gulp.dest(config.paths.lib))
    ]);
});