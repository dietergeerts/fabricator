'use strict';

var del      = require('del');
var gulp     = require('gulp');
var rename   = require('gulp-rename');
var svgStore = require('gulp-svgstore');
var svgMin   = require('gulp-svgmin');

module.exports = function (config) {

    var tasks = {};

    tasks.clean = function () {
        return del(config.toolkit.paths.dest.icons, {force: true});
    };

    tasks.run = function () {
        return gulp.src(config.toolkit.paths.icons)
            .pipe(svgMin())
            .pipe(svgStore({inlineSvg: true}))
            .pipe(gulp.dest(config.toolkit.paths.dest.icons));
    };

    return tasks;
};
