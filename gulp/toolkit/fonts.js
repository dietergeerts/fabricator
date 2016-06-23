'use strict';

var del  = require('del');
var gulp = require('gulp');

module.exports = function (config) {

	var tasks = {};

	tasks.clean = function (callback) {
		del(config.toolkit.paths.dest.fonts, {force: true}, callback);
	};

	tasks.run = function () {
		return gulp.src(config.toolkit.paths.fonts)
			.pipe(gulp.dest(config.toolkit.paths.dest.fonts));
	};

	return tasks;
};
