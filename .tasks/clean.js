'use strict';
var gulp = require("gulp"),
    clean = require('gulp-clean'),
    runSequence = require("run-sequence"),
    configuration = require('./@configuration.js');

gulp.task("clean", done => {
    return gulp.src([configuration.PATHS.LIB], { read: false })
        .pipe(clean());
});