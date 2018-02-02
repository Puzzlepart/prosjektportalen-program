'use strict';
var gulp = require("gulp"),
    tslint = require("gulp-tslint"),
    configuration = require('./@configuration.js');

gulp.task("tsLint", function () {
    return gulp.src(configuration.PATHS.SOURCE_GLOB)
        .pipe(tslint({ formatter: "prose" }))
        .pipe(tslint.report({ emitError: true }));
});