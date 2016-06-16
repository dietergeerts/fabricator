'use strict';

var config = require('./../config');
var del    = require('del');
var gulp   = require('gulp');

module.exports.clean = function (callback) {
	del(config.fabricator.paths.dest.samples, {force: true}, callback);
};

module.exports.run = function () {
	return gulp.src(config.fabricator.paths.samples)
		.pipe(gulp.dest(config.fabricator.paths.dest.samples));
};
