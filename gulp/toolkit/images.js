'use strict';

var del      = require('del');
var gulp     = require('gulp');
var imagemin = require('gulp-imagemin');

module.exports = function (config) {
	
	var tasks = {};

	tasks.clean = function (callback) {
		del(config.toolkit.paths.dest.images, {force: true}, callback);
	};

	tasks.run = function () {
		return gulp.src(config.toolkit.paths.images)
		//.pipe(imagemin()) TODO: Make imagemin work with all image files (or split svg/ico files elsewhere).
		.pipe(gulp.dest(config.toolkit.paths.dest.images));
	};

	return tasks;
};
