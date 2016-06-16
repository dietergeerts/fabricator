'use strict';

var concat     = require('gulp-concat');
var config     = require('./../config');
var csso       = require('gulp-csso');
var del        = require('del');
var gulp       = require('gulp');
var gulpif     = require('gulp-if');
var prefix     = require('gulp-autoprefixer');
var sass       = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

module.exports.clean = function (callback) {
	del(config.fabricator.paths.dest.styles, {force: true}, callback);
};

module.exports.run = function () {
	return gulp.src(config.fabricator.paths.styles)
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(prefix('last 1 version'))
		.pipe(gulpif(!config.fabricator.dev, csso()))
		.pipe(concat('fabricator.css'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(config.fabricator.paths.dest.styles));
};
