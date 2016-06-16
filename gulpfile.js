'use strict';

var _           = require('lodash');
var browserSync = require('browser-sync');
var config      = require('./gulp/config');
var gulp        = require('gulp');
var webpack     = require('./gulp/webpack');

gulp.task('default', ['assemble', 'assets', 'fabricator:favicon'], function () {
	if (config.fabricator.dev) {
		gulp.start('serve');
	}
});

gulp.task('assemble', ['toolkitConfig:generate'], getTask('assemble').run);

gulp.task('assets', ['assets:fabricator', 'assets:toolkit']);
gulp.task('assets:fabricator', ['fabricator:scripts', 'fabricator:styles', 'fabricator:samples']);
gulp.task('assets:toolkit', ['toolkit:scripts', 'toolkit:styles', 'toolkit:fonts']);

gulp.task('fabricator:favicon', getFabricatorTask('favicon').run);
gulp.task('fabricator:scripts', ['fabricator:scripts:clean'], getFabricatorTask('scripts').run);
gulp.task('fabricator:scripts:clean', getFabricatorTask('scripts').clean);
gulp.task('fabricator:styles', ['fabricator:styles:clean'], getFabricatorTask('styles').run);
gulp.task('fabricator:styles:clean', getFabricatorTask('styles').clean);
gulp.task('fabricator:samples', ['fabricator:samples:clean'], getFabricatorTask('samples').run);
gulp.task('fabricator:samples:clean', getFabricatorTask('samples').clean);

gulp.task('toolkit:scripts', ['toolkit:scripts:clean'], getToolkitTask('scripts').run);
gulp.task('toolkit:scripts:clean', getToolkitTask('scripts').clean);
gulp.task('toolkit:styles', ['toolkit:styles:clean', 'toolkitConfig:clearCache'], getToolkitTask('styles').run);
gulp.task('toolkit:styles:clean', getToolkitTask('styles').clean);
gulp.task('toolkit:fonts', ['toolkit:fonts:clean'], getToolkitTask('fonts').run);
gulp.task('toolkit:fonts:clean', getToolkitTask('fonts').clean);
gulp.task('toolkit:images', ['toolkit:images:clean'], getToolkitTask('images').run);
gulp.task('toolkit:images:clean', getToolkitTask('images').clean);

gulp.task('toolkitConfig:generate', ['toolkitConfig:clearCache'], getTask('toolkitConfig').generate);
gulp.task('toolkitConfig:clearCache', getTask('toolkitConfig').clearCache);

gulp.task('serve', function () {
	var browserSync = browserSync.create();

	gulp.task('assemble:changed', ['assemble'], browserSync.reload);
	gulp.task('fabricator:scripts:changed', ['fabricator:scripts'], browserSync.reload);
	gulp.task('fabricator:styles:changed', ['fabricator:styles'], browserSync.reload);
	gulp.task('fabricator:samples:changed', ['fabricator:samples'], browserSync.reload);
	gulp.task('toolkit:scripts:changed', ['toolkit:scripts'], browserSync.reload);
	gulp.task('toolkit:styles:changed', ['toolkit:styles'], browserSync.reload);
	gulp.task('toolkit:fonts:changed', ['toolkit:fonts'], browserSync.reload);
	gulp.task('toolkit:images:changed', ['toolkit:images'], browserSync.reload);
	gulp.task('toolkitConfig:changed', ['toolkit:styles', 'assemble'], browserSync.reload);

	browserSync.init({
		server: {baseDir: config.fabricator.paths.dest.base},
		notify: false,
		logPrefix: 'FABRICATOR-BUILDER'
	});

	gulp.watch(getAssembleSources(), ['assemble:changed']);
	gulp.watch(config.fabricator.paths.scripts, ['fabricator:scripts:changed'])
		.on('change', webpack.cleanCache(webpack.fabricator));
	gulp.watch(config.fabricator.paths.styles, ['fabricator:styles:changed']);
	gulp.watch(config.fabricator.paths.samples, ['fabricator:samples:changed']);
	gulp.watch(_(config.toolkit.paths.scripts).values().flatten().uniq().value(), ['toolkit:scripts:changed'])
		.on('change', webpack.cleanCache(webpack.toolkit));
	gulp.watch(_(config.toolkit.paths.styles).values().flatten().uniq().value(), ['toolkit:styles:changed']);
	gulp.watch(config.toolkit.paths.fonts, ['toolkit:fonts:changed']);
	gulp.watch(config.toolkit.paths.images, ['toolkit:images:changed']);
	gulp.watch(config.toolkit.paths.toolkitConfig, ['toolkitConfig:changed']);

	function getAssembleSources() {
		return _([
			config.fabricator.paths.data,
			config.fabricator.paths.docs,
			config.fabricator.paths.materials,
			config.fabricator.paths.package,
			config.fabricator.paths.templates,
			config.fabricator.paths.views
		]).flatten().value();
	}
});

function getTask(name) {
	return require('./gulp/' + name); 
}

function getFabricatorTask(name) { 
	return require('./gulp/fabricator/' + name); 
}

function getToolkitTask(name) { 
	return require('./gulp/toolkit/' + name); 
}
