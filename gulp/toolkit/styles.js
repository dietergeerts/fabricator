'use strict';

var _          = require('lodash');
var concat     = require('gulp-concat');
var csso       = require('gulp-csso');
var del        = require('del');
var gulp       = require('gulp');
var gulpif     = require('gulp-if');
var merge      = require('merge2');
var prefix     = require('gulp-autoprefixer');
var replace    = require('gulp-replace-task');
var sass       = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

module.exports = function (config) {
	
	var tasks = {};

	tasks.clean = function (callback) {
		del(config.toolkit.paths.dest.styles, {force: true}, callback);
	};

	tasks.run = function () {

		var styleReplacements = config.toolkit.paths.toolkitConfig
			? generateStyleReplacements(config.toolkit.paths.toolkitConfig)
			: {};

		return merge(_(config.toolkit.paths.styles).pairs().map(createStyleStream).value());

		function createStyleStream(namedSrc) {
			return gulp.src(namedSrc[1])
				.pipe(sourcemaps.init())
				.pipe(replace({patterns: [{json: styleReplacements}], usePrefix: false}))
				.pipe(sass().on('error', sass.logError))
				.pipe(prefix('last 1 version'))
				.pipe(gulpif(!config.fabricator.dev, csso()))
				.pipe(concat(namedSrc[0] + '.css'))
				.pipe(sourcemaps.write())
				.pipe(gulp.dest(config.toolkit.paths.dest.styles));
		}
	};
	
	return tasks;
	
 	function generateStyleReplacements(path) {

		return fillWithDataAndReturn({}, require('../../' + path));

		function fillWithDataAndReturn(replacements, data) {

			_.forOwn(data, function (value, key) {
				if (_.isObject(value)) {
					fillWithDataAndReturn(replacements, value);
				} else {
					replacements['/* ' + key + ' */'] = key + ': ' + value + ' !default;';
				}
			});

			return replacements;
		}
	}
};
