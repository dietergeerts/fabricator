'use strict';

var gulp = require('gulp');

module.exports = function (config) {
	
	var tasks = {};

	tasks.run = function () {
		return gulp.src(config.fabricator.paths.favicon)
			.pipe(gulp.dest(config.fabricator.paths.dest.images));
	};
	
	return tasks;
};
