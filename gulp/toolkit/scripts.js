'use strict';

var _      = require('lodash');
var del    = require('del');
var gulp   = require('gulp');
var jscs   = require('gulp-jscs');
var jshint = require('gulp-jshint');
var merge  = require('merge2');
var uglify = require('gulp-uglify');

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
        if (config.toolkit.useWebpack) {
		    return webpack.compile(webpack.toolkit)(callback);
        } else {
            return merge(_(config.toolkit.paths.scripts).pairs().map(createScriptStream).value());
        }
	};

	return tasks;

    function createScriptStream(namedSrc) {
        return gulp.src(namedSrc[1])
            .pipe(concat(namedSrc[0] + '.js'))
            .pipe(gulpif(!config.fabricator.dev, uglify()))
            .pipe(gulp.dest(config.toolkit.paths.dest.scripts));
    }
};
