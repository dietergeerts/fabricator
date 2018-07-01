'use strict';

var del  = require('del');
var gulp = require('gulp');

module.exports = function (config) {

    var tasks = {};

    tasks.clean = function () {
        return del(config.toolkit.paths.dest.images, {force: true});
    };

    tasks.run = function () {
        return gulp.src(config.toolkit.paths.images)
            .pipe(gulp.dest(config.toolkit.paths.dest.images));
    };

    return tasks;
};
