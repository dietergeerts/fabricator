'use strict';

var del  = require('del');
var gulp = require('gulp');

module.exports = function (config) {
	
	var tasks = {};

	tasks.clean = function () {
		return del(config.fabricator.paths.dest.samples, {force: true});
	};

	tasks.run = function () {
		return gulp.src(config.fabricator.paths.samples)
			.pipe(gulp.dest(config.fabricator.paths.dest.samples));
	};

	return tasks;
};
