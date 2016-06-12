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
var minimist    = require('minimist');
var ngAnnotate  = require('gulp-ng-annotate');
var prefix      = require('gulp-autoprefixer');
var rename      = require('gulp-rename');
var reload      = browserSync.reload;
var replace     = require('gulp-replace-task');
var runSequence = require('run-sequence');
var sass        = require('gulp-sass');
var sourcemaps  = require('gulp-sourcemaps');
var uglify      = require('gulp-uglify');
var webpack     = require('webpack');

var gulp    = require('gulp');
var plugins = require('gulp-load-plugins')();

var args             = minimist(process.argv.slice(2));
var fabricatorConfig = createConfig(getFabricatorConfig(args.config));
var webpackConfig    = require('./webpack.config')(fabricatorConfig);
var webpackCompiler  = webpack(webpackConfig);




var config = {
	fabricator: {
		dev: fabricatorConfig.dev,
		paths: {
			data: fabricatorConfig.paths.data,
			dest: fabricatorConfig.paths.dest,
			dest_fonts: '/assets/toolkit/fonts',
			dest_styles: '/assets/toolkit/styles',
			docs: fabricatorConfig.paths.docs,
			materials: fabricatorConfig.paths.materials,
			ngAppFile: fabricatorConfig.ngAppFile,
			toolkitConfig: './toolkitConfig.json',
			views: fabricatorConfig.paths.views
		}
	},
	toolkit: {
		paths: {
			fonts: fabricatorConfig.paths.toolkit.fonts,
			scripts: fabricatorConfig.paths.toolkit.scripts,
			styles: fabricatorConfig.paths.toolkit.styles,
			toolkitConfig: args.toolkitConfig
		}
	}
};






gulp.task('toolkitConfig:changed', ['toolkit:styles', 'assemble'], reload);
gulp.task('toolkitConfig:clearCache', require('./gulp/toolkitConfig.clearCache')(gulp, plugins, config));
gulp.task('toolkitConfig:generate', ['toolkitConfig:clearCache'], require('./gulp/toolkitConfig.generate')(gulp, plugins, config));

gulp.task('toolkit:fonts', ['toolkit:fonts:clean'], require('./gulp/toolkit.fonts')(gulp, plugins, config));
gulp.task('toolkit:fonts:clean', require('./gulp/toolkit.fonts.clean')(gulp, plugins, config));

gulp.task('toolkit:styles', ['toolkit:styles:clean', 'toolkitConfig:clearCache'], require('./gulp/toolkit.styles')(gulp, plugins, config));
gulp.task('toolkit:styles:clean', require('./gulp/toolkit.styles.clean')(gulp, plugins, config));

gulp.task('assemble', ['toolkitConfig:generate'], require('./gulp/assemble')(gulp, plugins, config));


















gulp.task('default', ['clean'], function () {
	runSequence(
		['styles', 'scripts', 'images', 'samples', 'toolkit:fonts', 'assemble'],
		function () { if (fabricatorConfig.dev) { gulp.start('serve'); } }
	);
});

gulp.task('clean', function (cb) { del([fabricatorConfig.paths.dest], {force: true}, cb); });

gulp.task('styles:fabricator', function () {
	gulp.src(fabricatorConfig.paths.fabricator.styles)
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(prefix('last 1 version'))
		.pipe(gulpif(!fabricatorConfig.dev, csso()))
		.pipe(rename('f.css'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(fabricatorConfig.paths.dest + '/assets/fabricator/styles'))
		.pipe(gulpif(fabricatorConfig.dev, reload({stream:true})));
});

gulp.task('styles', ['styles:fabricator', 'toolkit:styles']);

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
			createToolkitScriptStreams(fabricatorConfig.paths.toolkit.scripts, '/assets/toolkit/scripts')
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
			.pipe(gulpif(!fabricatorConfig.dev, uglify()))
			.pipe(concat(fileName))
			.pipe(gulp.dest(fabricatorConfig.paths.dest + dest));
	}

	function logError(error) { gutil.log(gutil.colors.red(error)); }
});

gulp.task('images:favicon', function () {
	return gulp.src('./src/favicon.ico')
		.pipe(gulp.dest(fabricatorConfig.paths.dest));
});

gulp.task('images', ['images:favicon'], function () {
	return gulp.src(fabricatorConfig.paths.toolkit.images)
		//.pipe(imagemin())  >> svg files and ico files didn't came with it.
		.pipe(gulp.dest(fabricatorConfig.paths.dest + '/assets/toolkit/images'));
});

gulp.task('samples', function () {
	return gulp.src(fabricatorConfig.paths.samples)
		.pipe(gulp.dest(fabricatorConfig.paths.dest + '/assets/samples'));
});




gulp.task('serve', function () {

	browserSync({
		server: {baseDir: fabricatorConfig.paths.dest},
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

	gulp.task('assemble:watch', ['assemble'], reload);
	gulp.watch(constructAssembleSourcesToWatch(), ['assemble:watch']);

	gulp.task('styles:fabricator:watch', ['styles:fabricator']);
	gulp.watch(createPathsForWatchingStyles(fabricatorConfig.paths.fabricator.styles), ['styles:fabricator:watch']);

	gulp.task('toolkit:styles:watch', ['toolkit:styles']);
	gulp.watch(constructToolkitStyleSourcesToWatch(), ['toolkit:styles:watch']);

	gulp.task('scripts:watch', ['scripts'], reload);
	gulp.watch(constructScriptSourcesToWatch(), ['scripts:watch'])
		.on('change', webpackCache);

	gulp.task('images:watch', ['images'], reload);
	gulp.watch(fabricatorConfig.paths.toolkit.images, ['images:watch']);

	gulp.task('samples:watch', ['samples'], reload);
	gulp.watch(fabricatorConfig.paths.samples, ['samples:watch']);




	gulp.watch(config.toolkit.paths.toolkitConfig, ['toolkitConfig:changed']);
});


// FABRICATORCONFIG.JSON ///////////////////////////////////////////////////////////////////////////////////////////////
//
// The 'required' ones, which have the following defaults:
//
//	"useWebpack": true  // Webpack doesn't work well with bower modules!
//	"views"     : ["./src/views/**/*", "!./src/views/+(layouts)/**"],
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
//  "pages"          : ['']  // If you use your own pages (from another project).
//	"ngApp"          :  ''   // A js file which is the app for your toolkit, added to f.js.
//	"buildDest"      :  ''   // A custom folder to build production to, %s will be replaced by build name.
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getFabricatorConfig(projectConfigFilePath) {
	return _.merge({},
		getBuilderFabricatorConfig(),
		getProjectFabricatorConfig(projectConfigFilePath));

	function getBuilderFabricatorConfig() { return require('./fabricatorConfig.json'); }

	function getProjectFabricatorConfig(configFilePath) { return configFilePath ? require(configFilePath) : {}; }
}

function createConfig(fabricatorConfig, build) {
	var development = gutil.env.dev;

	var fabricatorConfig = {
		dev: development,
		useWebpack: fabricatorConfig.useWebpack,
		paths: {
			fabricator: {
				scripts: ['./src/assets/fabricator/scripts/fabricator.js'],
				styles: ['./src/assets/fabricator/styles/fabricator.scss']
			},
			toolkit: {
				scripts: fabricatorConfig.scripts,
				styles: fabricatorConfig.styles,
				images: createPathsForBuild(fabricatorConfig.images, build),
				fonts: fabricatorConfig.fonts
			},
			samples: fabricatorConfig.samples,
			views: createConfigViewsPaths(fabricatorConfig),
			materials: fabricatorConfig.materials,
			data: generateFabricatorConfigDataPaths(fabricatorConfig),
			docs: fabricatorConfig.docs,
			dest: createConfigDestPath(fabricatorConfig, build, development)
		}
	};

	var pages = _.get(fabricatorConfig, 'pages', []);
	if (_.size(pages) > 0) { fabricatorConfig.paths.pages = fabricatorConfig.pages; }

	var ngAppFile = _.get(fabricatorConfig, 'ngApp', '');
	if (ngAppFile !== '') {
		fabricatorConfig.ngAppFile = ngAppFile;
		fabricatorConfig.paths.toolkit.scripts['toolkit-test-app'] = [ngAppFile];	}

	return fabricatorConfig;
}

function createConfigViewsPaths(fabricatorConfig) {
	var projectPages = _.get(fabricatorConfig, 'pages', []);
	return _.union(
		fabricatorConfig.views,
		_.size(projectPages) > 0 ? ['!./src/views/templates{,/**}'] : [],
		projectPages
	);
}


// Generate the glob pattern to use as data for fabricator-assemble.
function generateFabricatorConfigDataPaths(fabricatorConfig) {
	return [fabricatorConfig.package];
}

function createConfigDestPath(fabricatorConfig, build, development) {
	var buildDest = _.get(fabricatorConfig, 'buildDest', '');
	return (!development && buildDest !== '') ? createPathForBuild(buildDest, build) : 'dist';
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
		fabricatorConfig.paths.views,
		fabricatorConfig.paths.materials,
		_.get(fabricatorConfig.paths, 'pages', []),
		fabricatorConfig.paths.data,
		fabricatorConfig.paths.docs
	);
}

function constructToolkitStyleSourcesToWatch() {
	var stylesToWatch = [];
	_.forOwn(fabricatorConfig.paths.toolkit.styles, function (src) {
		stylesToWatch = _.union(stylesToWatch, src); });
	return createPathsForWatchingStyles(stylesToWatch);
}

function constructScriptSourcesToWatch() {
	var scriptsToWatch = fabricatorConfig.paths.fabricator.scripts;
	_.forOwn(fabricatorConfig.paths.toolkit.scripts, function (src) {
		scriptsToWatch = _.union(scriptsToWatch, src); });
	return scriptsToWatch;
}

