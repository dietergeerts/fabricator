'use strict';

var del      = require('del');
var foreach  = require('gulp-each');
var gulp     = require('gulp');
var svgMin   = require('gulp-svgmin');

module.exports = function (config, iconCache) {

    var tasks = {};

    tasks.clean = function () {
        return del(config.toolkit.paths.dest.icons, {force: true});
    };

    tasks.run = function () {
        return gulp.src(config.toolkit.paths.icons)
            .pipe(svgMin())
            .pipe(foreach(storeInIconCache))
            .pipe(gulp.dest(config.toolkit.paths.dest.icons));
    };

    return tasks;

    function storeInIconCache(content, file, callback) {
        iconCache[file.path.substring(file.base.length, file.path.length - 4)] = content;
        callback(null, content);
    }
};
