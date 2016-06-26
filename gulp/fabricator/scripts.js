'use strict';

var del    = require('del');
var gulp   = require('gulp');
var jscs   = require('gulp-jscs');
var jshint = require('gulp-jshint');

module.exports = function (config, webpack) {

	var tasks = {};

	tasks.clean = function () {
		return del(config.fabricator.paths.dest.scripts, {force: true});
	};

    tasks.analyze = function (callback) {
        return gulp.src(config.fabricator.paths.scripts)
            .pipe(jscs({configPath: config.fabricator.paths.jscsrc, fix: true}))
            .pipe(jscs.reporter())
            .pipe(jscs.reporter('fail')) // Fail on warnings and errors >> add ignores in code if necessary!
            .pipe(jshint(config.fabricator.paths.jshintrc))
            .pipe(jshint.reporter('jshint-practical'))
            .pipe(jshint.reporter('fail')); // Fail on warnings and errors >> add ignores in code if necessary!
    };

	tasks.run = function (callback) {
		return webpack.compile(webpack.fabricator)(callback);
	};

	return tasks;
};
