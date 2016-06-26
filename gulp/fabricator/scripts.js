'use strict';

var del     = require('del');
var gulp    = require('gulp');
var jscs    = require('gulp-jscs');
var jshint  = require('gulp-jshint');
var webpack = require('webpack-stream');

module.exports = function (config, webpackConfig) {

	var tasks = {};

	tasks.clean = function () {
		return del(config.fabricator.paths.dest.scripts, {force: true});
	};

    tasks.analyze = function () {
        return gulp.src(config.fabricator.paths.scripts)
            .pipe(jscs({configPath: config.fabricator.paths.jscsrc, fix: true}))
            .pipe(jscs.reporter())
            .pipe(jscs.reporter('fail')) // Fail on warnings and errors >> add ignores in code if necessary!
            .pipe(jshint(config.fabricator.paths.jshintrc))
            .pipe(jshint.reporter('jshint-practical'))
            .pipe(jshint.reporter('fail')); // Fail on warnings and errors >> add ignores in code if necessary!
    };

	tasks.run = function () {
        return gulp.src(config.fabricator.paths.scripts)
            .pipe(webpack(webpackConfig.fabricator))
            .pipe(gulp.dest(config.fabricator.paths.dest.scripts));
	};

	return tasks;
};
