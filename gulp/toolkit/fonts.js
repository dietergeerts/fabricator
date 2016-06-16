'use strict';

var config = require('./../config');
var del    = require('del');
var gulp   = require('gulp');

module.exports.clean = function (callback) {
	del(config.toolkit.paths.dest.fonts, {force: true}, callback);
};

module.exports.run = function () {
	return gulp.src(config.toolkit.paths.fonts)
		.pipe(gulp.dest(config.toolkit.paths.dest.fonts));
};
