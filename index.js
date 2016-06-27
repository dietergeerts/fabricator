'use strict';

var _           = require('lodash');
var browserSync = require('browser-sync');
var gulp        = require('gulp');

module.exports = function (fabricatorConfig, dev) {

    var config        = require('./gulp/config')(fabricatorConfig, dev);
	var webpackConfig = require('./gulp/webpackConfig')(config);

	gulp.task('f:default', ['f:assemble', 'f:assets', 'f:fabricator:favicon'], function () {
        if (config.fabricator.dev) {
			gulp.start('serve'); // gulp.start = push to tasks queue.
		}
	});

	gulp.task('f:assemble', ['f:toolkitConfig:generate'], getTask('assemble').run);

	gulp.task('f:assets', ['f:assets:fabricator', 'f:assets:toolkit']);
	gulp.task('f:assets:fabricator', ['f:fabricator:scripts', 'f:fabricator:styles', 'f:fabricator:samples']);
	gulp.task('f:assets:toolkit', ['f:toolkit:analyze', 'f:toolkit:scripts', 'f:toolkit:styles', 'f:toolkit:fonts', 'f:toolkit:images']);

	gulp.task('f:fabricator:favicon', getFabricatorTask('favicon').run);
	gulp.task('f:fabricator:scripts', ['f:fabricator:scripts:clean', 'f:fabricator:scripts:analyze'], getFabricatorTask('scripts').run);
	gulp.task('f:fabricator:scripts:clean', getFabricatorTask('scripts').clean);
    gulp.task('f:fabricator:scripts:analyze', getFabricatorTask('scripts').analyze);
	gulp.task('f:fabricator:styles', ['f:fabricator:styles:clean'], getFabricatorTask('styles').run);
	gulp.task('f:fabricator:styles:clean', getFabricatorTask('styles').clean);
	gulp.task('f:fabricator:samples', ['f:fabricator:samples:clean'], getFabricatorTask('samples').run);
	gulp.task('f:fabricator:samples:clean', getFabricatorTask('samples').clean);

    gulp.task('f:toolkit:analyze', getToolkitTask('scripts').analyze);
	gulp.task('f:toolkit:scripts', ['f:toolkit:scripts:clean'], getToolkitTask('scripts').run);
	gulp.task('f:toolkit:scripts:clean', getToolkitTask('scripts').clean);
	gulp.task('f:toolkit:styles', ['f:toolkit:styles:clean', 'f:toolkitConfig:clearCache'], getToolkitTask('styles').run);
	gulp.task('f:toolkit:styles:clean', getToolkitTask('styles').clean);
	gulp.task('f:toolkit:fonts', ['f:toolkit:fonts:clean'], getToolkitTask('fonts').run);
	gulp.task('f:toolkit:fonts:clean', getToolkitTask('fonts').clean);
	gulp.task('f:toolkit:images', ['f:toolkit:images:clean'], getToolkitTask('images').run);
	gulp.task('f:toolkit:images:clean', getToolkitTask('images').clean);

	gulp.task('f:toolkitConfig:generate', ['f:toolkitConfig:clearCache'], getTask('toolkitConfig').generate);
	gulp.task('f:toolkitConfig:clearCache', getTask('toolkitConfig').clearCache);

	gulp.task('serve', function () {

		browserSync({
			server: {baseDir: config.fabricator.paths.dest.base},
			notify: false,
			logPrefix: 'FABRICATOR-BUILDER'
		});

		gulp.task('f:assemble:changed', ['f:assemble'], browserSync.reload);
		gulp.task('f:fabricator:scripts:changed', ['f:fabricator:scripts'], browserSync.reload);
		gulp.task('f:fabricator:styles:changed', ['f:fabricator:styles'], browserSync.reload);
		gulp.task('f:fabricator:samples:changed', ['f:fabricator:samples'], browserSync.reload);
		gulp.task('f:toolkit:analyze:changed', ['f:toolkit:analyze'], browserSync.reload);
        gulp.task('f:toolkit:scripts:changed', ['f:toolkit:scripts'], browserSync.reload);
		gulp.task('f:toolkit:styles:changed', ['f:toolkit:styles'], browserSync.reload);
		gulp.task('f:toolkit:fonts:changed', ['f:toolkit:fonts'], browserSync.reload);
		gulp.task('f:toolkit:images:changed', ['f:toolkit:images'], browserSync.reload);
		gulp.task('f:toolkitConfig:changed', ['f:toolkit:styles', 'f:assemble'], browserSync.reload);

		gulp.watch(getAssembleSources(), ['f:assemble:changed']);
		gulp.watch(config.fabricator.paths.scripts, ['f:fabricator:scripts:changed'])
            .on('change', webpackConfig.cleanCache(webpackConfig.fabricator));
		gulp.watch(config.fabricator.paths.styles, ['f:fabricator:styles:changed']);
		gulp.watch(config.fabricator.paths.samples, ['f:fabricator:samples:changed']);
        gulp.watch(config.toolkit.paths.analyze, ['f:toolkit:analyze:changed']);
		gulp.watch(_(config.toolkit.paths.scripts).values().flatten().uniq().value(), ['f:toolkit:scripts:changed'])
            .on('change', webpackConfig.cleanCache(webpackConfig.toolkit));
		gulp.watch(_(config.toolkit.paths.styles).values().flatten().uniq().value(), ['f:toolkit:styles:changed']);
		gulp.watch(config.toolkit.paths.fonts, ['f:toolkit:fonts:changed']);
		gulp.watch(config.toolkit.paths.images, ['f:toolkit:images:changed']);
		gulp.watch(config.toolkit.paths.toolkitConfig, ['f:toolkitConfig:changed']);

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
    
    gulp.start('f:default'); // gulp.start = push to tasks queue.

	function getTask(name) {
		return require('./gulp/' + name)(config, webpackConfig);
	}

	function getFabricatorTask(name) {
		return require('./gulp/fabricator/' + name)(config, webpackConfig);
	}

	function getToolkitTask(name) {
		return require('./gulp/toolkit/' + name)(config, webpackConfig);
	}
};
