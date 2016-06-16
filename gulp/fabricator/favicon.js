'use strict';

var config = require('./../config');
var gulp   = require('gulp');

module.exports.run = function () {
	return gulp.src(config.fabricator.paths.favicon)
		.pipe(gulp.dest(config.fabricator.paths.dest.base));
};
