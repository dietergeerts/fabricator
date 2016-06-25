'use strict';

var _      = require('lodash');
var del    = require('del');
var gulp   = require('gulp');
var jscs   = require('gulp-jscs');
var jshint = require('gulp-jshint');

module.exports = function (config, webpack) {

	var tasks = {};

	tasks.clean = function (callback) {
		del(config.toolkit.paths.dest.scripts, {force: true}, callback);
	};

    tasks.analyze = function (callback) {
        return gulp.src(_(config.toolkit.paths.scripts).values().flatten().value())
            .pipe(jscs({configPath: config.toolkit.paths.jscsrc || config.fabricator.paths.jscsrc, fix: true}))
            .pipe(jscs.reporter())
            .pipe(jscs.reporter('fail')) // Fail on warnings and errors >> add ignores in code if necessary!
            .pipe(jshint(config.toolkit.paths.jshintrc || config.fabricator.paths.jshintrc))
            .pipe(jshint.reporter('jshint-practical'))
            .pipe(jshint.reporter('fail')); // Fail on warnings and errors >> add ignores in code if necessary!
    };

    tasks.run = function (callback) {
		return webpack.compile(webpack.toolkit)(callback);
	};

	return tasks;
};
