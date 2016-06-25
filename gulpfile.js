'use strict';

// This file is just for testing, the real toolkit will always use gulp, and then
// start our tasks with it by calling the fabricator we have exported with index.js.

var concat     = require('gulp-concat');
var fabricator = require('./index');
var gulp       = require('gulp');
var gutil      = require('gulp-util');
var ngAnnotate = require('gulp-ng-annotate');

gulp.task('default', ['scripts:prepare'], function () {

    // Start Fabricator Builder.
    fabricator(require('./test/fabricatorConfig'), gutil.env.dev);

    // If dev option is on, Fabricator Builder will have browserSync setup!
    // So we can now add watchers, to re-run our own preparation tasks.
    if (gutil.env.dev) {
        
        gulp.watch('./test/assets/scripts/**/*.js', ['scripts:prepare']);
    }
});

gulp.task('scripts:prepare', function () {
    return gulp.src('./test/assets/scripts/**/*.js')
        .pipe(ngAnnotate())
        .pipe(concat('toolkit.js'))
        .pipe(gulp.dest('./test/assets/prepared/'));
});
