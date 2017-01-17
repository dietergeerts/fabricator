'use strict';

var _       = require('lodash');
var concat  = require('gulp-concat');
var del     = require('del');
var filter  = require('gulp-filter');
var gulp    = require('gulp');
var gulpif  = require('gulp-if');
var jscs    = require('gulp-jscs');
var jshint  = require('gulp-jshint');
var merge   = require('merge2');
var tslint  = require('gulp-tslint');
var uglify  = require('gulp-uglify');
var webpack = require('webpack-stream');

module.exports = function (config, webpackConfig) {

	var tasks = {};

	tasks.clean = function () {
		return del(config.toolkit.paths.dest.scripts, {force: true});
	};

    tasks.analyze = function () {

        const jsFilter = filter('*.js', {restore: true});
        const tsFilter = filter('*.ts', {restore: true});

        return gulp.src(config.toolkit.paths.analyze)
            .pipe(jsFilter)
            .pipe(jscs({configPath: config.toolkit.paths.jscsrc || config.fabricator.paths.jscsrc}))
            .pipe(jscs.reporter())
            // Fail on warnings and errors >> add ignores in code if necessary!
            .pipe(gulpif(!config.fabricator.dev, jscs.reporter('fail')))
            .pipe(jshint(config.toolkit.paths.jshintrc || config.fabricator.paths.jshintrc))
            .pipe(jshint.reporter('jshint-practical'))
            // Fail on warnings and errors >> add ignores in code if necessary!
            .pipe(gulpif(!config.fabricator.dev, jshint.reporter('fail')))
            .pipe(jsFilter.restore)
            .pipe(tsFilter)
            .pipe(tslint({configuration: config.toolkit.paths.tslint || config.fabricator.paths.tslint}))
            // Fail on warnings and errors >> add ignores in code if necessary!
            .pipe(tslint.report({emitError: !config.fabricator.dev}))
            .pipe(tsFilter.restore);
    };

    tasks.run = function () {
        if (config.toolkit.useWebpack) {
            return gulp.src(_(config.toolkit.paths.scripts).values().flatten().value())
                .pipe(webpack(webpackConfig.toolkit))
                .pipe(gulp.dest(config.toolkit.paths.dest.scripts));
        } else {
            return merge(_(config.toolkit.paths.scripts).toPairs().map(createScriptStream).value());
        }
	};

	return tasks;

    function createScriptStream(namedSrc) {
        return gulp.src(namedSrc[1])
            .pipe(gulpif(!config.fabricator.dev, uglify()))
            .pipe(concat(namedSrc[0] + '.js'))
            .pipe(gulp.dest(config.toolkit.paths.dest.scripts));
    }
};
