'use strict';
var gulp = require("gulp"),
    tslint = require("gulp-tslint"),
    config = require('./@configuration.js');

gulp.task("tsLint", function () {
    return gulp.src(config.paths.sourceGlob)
        .pipe(tslint({ formatter: "prose" }))
        .pipe(tslint.report({ emitError: true }));
});