'use strict';

var config = require('./config');
var gulp   = require('gulp');

module.exports = function () {
	return gulp.src(config.toolkit.paths.fonts)
		.pipe(gulp.dest(config.toolkit.paths.dest.fonts));
};
