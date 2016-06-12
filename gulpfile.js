'use strict';

var _           = require('lodash');
var browserSync = require('browser-sync');
var concat      = require('gulp-concat');
var csso        = require('gulp-csso');
var del         = require('del');
var fs          = require('fs');
var gutil       = require('gulp-util');
var gulpif      = require('gulp-if');
var imagemin    = require('gulp-imagemin');
var merge       = require('merge2');
var ngAnnotate  = require('gulp-ng-annotate');
var prefix      = require('gulp-autoprefixer');
var rename      = require('gulp-rename');
var replace     = require('gulp-replace-task');
var runSequence = require('run-sequence');
var sass        = require('gulp-sass');
var sourcemaps  = require('gulp-sourcemaps');
var uglify      = require('gulp-uglify');
var webpack     = require('webpack');

var gulp = require('gulp');

var fabricatorConfig = createConfig(gutil.env.config);
var webpackConfig    = require('./webpack.config')(fabricatorConfig);
var webpackCompiler  = webpack(webpackConfig);






var config = require('./gulp/config');

gulp.task('toolkitConfig:clearCache', require('./gulp/toolkitConfig.clearCache'));
gulp.task('toolkitConfig:generate', ['toolkitConfig:clearCache'], require('./gulp/toolkitConfig.generate'));

gulp.task('assemble', ['toolkitConfig:generate'], require('./gulp/assemble'));

gulp.task('toolkit:fonts:clean', require('./gulp/toolkit.fonts.clean'));
gulp.task('toolkit:fonts', ['toolkit:fonts:clean'], require('./gulp/toolkit.fonts'));

gulp.task('toolkit:styles:clean', require('./gulp/toolkit.styles.clean'));
gulp.task('toolkit:styles', ['toolkit:styles:clean', 'toolkitConfig:clearCache'], require('./gulp/toolkit.styles'));

gulp.task('fabricator:styles:clean', require('./gulp/fabricator.styles.clean'));
gulp.task('fabricator:styles', ['fabricator:styles:clean'], require('./gulp/fabricator.styles'));





gulp.task('toolkitConfig:changed', ['toolkit:styles', 'assemble'], browserSync.reload);

gulp.task('default', ['clean'], function () {
	runSequence(
		['styles', 'scripts', 'images', 'samples', 'toolkit:fonts', 'assemble'],
		function () { if (config.fabricator.dev) { gulp.start('serve'); } }
	);
});

gulp.task('clean', function (cb) { del(config.fabricator.paths.dest.base, {force: true}, cb); });



gulp.task('scripts', function (done) {
	if (fabricatorConfig.useWebpack) {
		webpackCompiler.run(function (error, result) {
			if (error) { logError(error); }

			result = result.toJson();
			if (result.errors.length) { result.errors.forEach(logError); }

			done();
		});
	} else {
		return merge(
			createScriptStream(constructFabricatorScriptSrc(), '/assets/fabricator/scripts', 'f.js'),
			createToolkitScriptStreams(config.toolkit.paths.scripts, '/assets/toolkit/scripts')
		);
	}

	function constructFabricatorScriptSrc() {
		return _.union([
			'./node_modules/match-media/matchMedia.js',
			'./node_modules/match-media/matchMedia.addListener.js',
			'./src/assets/fabricator/scripts/prism.js'
			], fabricatorConfig.paths.fabricator.scripts);
	}

	function createToolkitScriptStreams(src, dest) {
		return _.map(_.pairs(src), function (namedSrc) {
			return createScriptStream(namedSrc[1], dest, namedSrc[0] + '.js');
		});
	}

	function createScriptStream(src, dest, fileName) {
		return gulp.src(src)
			.pipe(ngAnnotate({add: true, single_quotes: true}))
			.pipe(gulpif(!config.fabricator.dev, uglify()))
			.pipe(concat(fileName))
			.pipe(gulp.dest(config.fabricator.paths.dest.base + dest));
	}

	function logError(error) { gutil.log(gutil.colors.red(error)); }
});

gulp.task('images:favicon', function () {
	return gulp.src('./src/favicon.ico')
		.pipe(gulp.dest(config.fabricator.paths.dest.base));
});

gulp.task('images', ['images:favicon'], function () {
	return gulp.src(fabricatorConfig.paths.toolkit.images)
		//.pipe(imagemin())  >> svg files and ico files didn't came with it.
		.pipe(gulp.dest(config.fabricator.paths.dest.base + '/assets/toolkit/images'));
});

gulp.task('samples', function () {
	return gulp.src(fabricatorConfig.paths.samples)
		.pipe(gulp.dest(config.fabricator.paths.dest.base + '/assets/samples'));
});




gulp.task('serve', function () {

	browserSync({
		server: {baseDir: config.fabricator.paths.dest.base},
		notify: false,
		logPrefix: 'FABRICATOR'
	});

	// Because webpackCompiler.watch() isn't being used
	// manually remove the changed file path from the cache
	function webpackCache(e) {
		var keys = Object.keys(webpackConfig.cache);
		var key, matchedKey;
		for (var keyIndex = 0; keyIndex < keys.length; keyIndex++) {
			key = keys[keyIndex];
			if (key.indexOf(e.path) !== -1) { matchedKey = key; break; }
		}
		if (matchedKey) { delete webpackConfig.cache[matchedKey]; }
	}

	gulp.task('assemble:watch', ['assemble'], browserSync.reload);
	gulp.watch(constructAssembleSourcesToWatch(), ['assemble:watch']);

	gulp.task('styles:fabricator:watch', ['styles:fabricator']);
	gulp.watch(createPathsForWatchingStyles(fabricatorConfig.paths.fabricator.styles), ['styles:fabricator:watch']);

	gulp.task('toolkit:styles:watch', ['toolkit:styles']);
	gulp.watch(constructToolkitStyleSourcesToWatch(), ['toolkit:styles:watch']);

	gulp.task('scripts:watch', ['scripts'], browserSync.reload);
	gulp.watch(constructScriptSourcesToWatch(), ['scripts:watch'])
		.on('change', webpackCache);

	gulp.task('images:watch', ['images'], browserSync.reload);
	gulp.watch(fabricatorConfig.paths.toolkit.images, ['images:watch']);

	gulp.task('samples:watch', ['samples'], browserSync.reload);
	gulp.watch(fabricatorConfig.paths.samples, ['samples:watch']);




	gulp.watch(config.toolkit.paths.toolkitConfig, ['toolkitConfig:changed']);
});


// FABRICATORCONFIG.JSON ///////////////////////////////////////////////////////////////////////////////////////////////
//
// The 'required' ones, which have the following defaults:
//
//	"useWebpack": true  // Webpack doesn't work well with bower modules!
//	"materials" : ["./src/materials/**/*"],
//	"data"      : ["./src/data/**/*.{json,yml}"],
//	"samples"   : ["./src/samples/**/*"],
//	"docs"      : ["./src/docs/**/*.md"],
//	"scripts"   : {  // Each prop will be a script file.
// 		"toolkit": ["./src/assets/toolkit/scripts/toolkit.js"]
// 	},
//	"styles"    : {  // Each prop will be a stylesheet file.
// 		"toolkit": ["./src/assets/toolkit/styles/toolkit.scss"]
// 	},
//	"fonts"     : ["./src/assets/toolkit/fonts/**/*"],
//	"images"    : ["./src/assets/toolkit/images/**/*"]
//
// The 'optional' ones:
//
//  "templates"          : ['']  // If you use your own templates (from another project).
//	"dest"      :  ''   // A custom folder to build production to.
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createConfig(fabricatorConfig, build) {

	var fabricatorConfig = {
		useWebpack: fabricatorConfig.useWebpack,
		paths: {
			fabricator: {
				scripts: ['./src/assets/fabricator/scripts/fabricator.js']
			},
			toolkit: {
				images: createPathsForBuild(fabricatorConfig.images, build)
			},
			samples: fabricatorConfig.samples
		}
	};

	return fabricatorConfig;
}


function createPathsForBuild(paths, build) {
	return _.map(paths, function (path) { return createPathForBuild(path, build); })
}

function createPathForBuild(path, build) {
	return path.replace('%s', build);
}

function createPathsForWatchingStyles(paths) {
	return _.map(paths, function (path) {
		return createPathFromArrayOfStrings(_.dropRight(path.split('/'))) + '/**/*.scss';
	});
}

function createPathFromArrayOfStrings(strings) {
	return _.reduce(strings, function (result, piece) { return result + '/' + piece; });
}




function constructAssembleSourcesToWatch() {
	return _.union(
		config.fabricator.paths.views,
		config.fabricator.paths.materials,
		_.get(config.fabricator.paths, 'templates', []),
		config.fabricator.paths.data,
		config.fabricator.paths.docs,
		[config.fabricator.paths.package]
	);
}

function constructToolkitStyleSourcesToWatch() {
	var stylesToWatch = [];
	_.forOwn(config.toolkit.paths.styles, function (src) {
		stylesToWatch = _.union(stylesToWatch, src); });
	return createPathsForWatchingStyles(stylesToWatch);
}

function constructScriptSourcesToWatch() {
	var scriptsToWatch = fabricatorConfig.paths.fabricator.scripts;
	_.forOwn(config.toolkit.paths.scripts, function (src) {
		scriptsToWatch = _.union(scriptsToWatch, src); });
	return scriptsToWatch;
}

