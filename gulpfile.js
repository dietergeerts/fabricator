'use strict';

var _           = require('lodash');
var assemble    = require('fabricator-assemble');
var browserSync = require('browser-sync');
var concat      = require('gulp-concat');
var csso        = require('gulp-csso');
var del         = require('del');
var fs          = require('fs');
var gulp        = require('gulp');
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

var args             = minimist(process.argv.slice(2));
var toolkitConfig    = args.toolkitConfig;
var fabricatorConfig = createConfig(getFabricatorConfig(args.config));
var webpackConfig    = require('./webpack.config')(fabricatorConfig);
var webpackCompiler  = webpack(webpackConfig);

var sassOptions = {
	precision: 10
};

initializeBuild();

gulp.task('default', ['clean'], function () {
	runSequence(
		['styles', 'scripts', 'images', 'samples', 'assemble'],
		function () { if (fabricatorConfig.dev) { gulp.start('serve'); } }
	);
});

gulp.task('clean', function (cb) { del([fabricatorConfig.paths.dest], {force: true}, cb); });

gulp.task('styles:fabricator', function () {
	gulp.src(fabricatorConfig.paths.fabricator.styles)
		.pipe(sourcemaps.init())
		.pipe(sass(sassOptions).on('error', sass.logError))
		.pipe(prefix('last 1 version'))
		.pipe(gulpif(!fabricatorConfig.dev, csso()))
		.pipe(rename('f.css'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(fabricatorConfig.paths.dest + '/assets/fabricator/styles'))
		.pipe(gulpif(fabricatorConfig.dev, reload({stream:true})));
});

gulp.task('toolkit:styles:fonts', function () {
	return gulp.src(fabricatorConfig.paths.toolkit.fonts)
		.pipe(gulp.dest(fabricatorConfig.paths.dest + '/assets/toolkit/fonts'));
});

gulp.task('toolkit:styles', ['toolkit:styles:fonts'], function () {
	var styleReplacements = createStyleReplacementsFromConfig();

	return merge(_.map(_.pairs(fabricatorConfig.paths.toolkit.styles), createToolkitStyleStream))
		.pipe(gulpif(fabricatorConfig.dev, reload({stream: true})));

	function createToolkitStyleStream(namedSrc) {
		return gulp.src(namedSrc[1])
			.pipe(sourcemaps.init())
			.pipe(replace({patterns: [{json: styleReplacements}], usePrefix: false}))
			.pipe(sass(sassOptions).on('error', sass.logError))
			.pipe(prefix('last 1 version'))
			.pipe(gulpif(!fabricatorConfig.dev, csso()))
			.pipe(concat(namedSrc[0] + '.css'))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(fabricatorConfig.paths.dest + '/assets/toolkit/styles'));
	}
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

gulp.task('assemble', function (done) {
	initializeBuildConfigInfo();
	assemble({
		logErrors: fabricatorConfig.dev,
		views    : fabricatorConfig.paths.views,
		materials: fabricatorConfig.paths.materials,
		data     : fabricatorConfig.paths.data,
		docs     : fabricatorConfig.paths.docs,
		dest     : fabricatorConfig.paths.dest
	});
	done();
});


// This task will be run when the project toolkitConfig file has changed.
// It is set-up in the serve task, which will watch the toolkitConfig file.
gulp.task('toolkitConfigChanged', function (callback) {

	// We use require to get the contents of the toolkitConfig file.
	// So we need to delete it from the cache, so it will get updated.
	delete require.cache[require.resolve(toolkitConfig)];

	// We generate our own toolkitConfig file, as we use it to add
	// other data to it, which can then be used by our views and pages.
	generateToolkitConfigFile();

	// After the toolkitConfig file is generated,
	// we run the tasks that depends on it for its data.
	runSequence(['toolkit:styles', 'assemble'], callback);
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

	gulp.task('toolkitConfig:watch', ['toolkitConfigChanged'], reload);
	gulp.watch(toolkitConfig, ['toolkitConfig:watch']);
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
//	"buildConfigInfo":  ''   // A file with buildConfigInfo.
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
			data: createConfigDataPaths(fabricatorConfig),
			docs: fabricatorConfig.docs,
			dest: createConfigDestPath(fabricatorConfig, build, development)
		}
	};

	var buildConfigInfoFile = _.get(fabricatorConfig, 'buildConfigInfo', '');
	if (buildConfigInfoFile !== '') { fabricatorConfig.buildConfigInfoFile = buildConfigInfoFile; }

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
		projectPages,
		(_.has(fabricatorConfig, 'buildConfigInfo') ? '' : '!') + './src/views/configuration.html'
	);
}

function createConfigDataPaths(fabricatorConfig) {
	return _.union(
		[fabricatorConfig.package, './toolkitConfig.json'],
		_.has(fabricatorConfig, 'buildConfigInfo') ? ['./buildConfigInfo.json'] : []
	);
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

function initializeBuild() {
	generateToolkitConfigFile();
	initializeBuildConfigInfo();
}

function generateToolkitConfigFile() {

	fs.writeFileSync('./toolkitConfig.json', JSON.stringify(createBuildConfigData()));

	function createBuildConfigData() {
		var buildConfigData = _.chain(toolkitConfig ? require(toolkitConfig) : {})
			.set('toolkitScripts', _.keys(fabricatorConfig.paths.toolkit.scripts))
			.set('toolkitStyles', _.keys(fabricatorConfig.paths.toolkit.styles))
			.value();

		var ngAppFile = _.get(fabricatorConfig, 'ngAppFile', '');
		if (ngAppFile !== '') { buildConfigData.ngAppName = getFileName(ngAppFile); }

		return buildConfigData;
	}
}

function initializeBuildConfigInfo() {
	// Besides the use of toolkitConfig, it's possible to list info about these configurations on a
	// separate page. When buildConfigInfo is filled into the fabricatorConfig file, we'll add this page.
	// REMARK: Will be run before the actual assemble, as for watchers.

	var buildConfigInfoFile = _.get(fabricatorConfig, 'buildConfigInfoFile', '');
	if (buildConfigInfoFile !== '') {
		delete require.cache[require.resolve(buildConfigInfoFile)];  // This changes by the user!
		fs.writeFileSync('./buildConfigInfo.json', JSON.stringify(require(buildConfigInfoFile)));
	}
}

function createStyleReplacementsFromConfig() {
	var replacements = {};
	if (toolkitConfig) {
		fillReplacementsWithData(replacements, require(toolkitConfig));
	}
	return replacements;

	function fillReplacementsWithData(replacements, data) {
		_.forOwn(data, function (value, key) {
			if (_.isObject(value)) { fillReplacementsWithData(replacements, value); }
			else { replacements['/* ' + key + ' */'] = key + ': ' + value + ' !default;'; }
		});
	}
}

function constructAssembleSourcesToWatch() {
	var buildConfigInfoFile = _.get(fabricatorConfig, 'buildConfigInfoFile', '');

	return _.union(
		fabricatorConfig.paths.views,
		fabricatorConfig.paths.materials,
		_.get(fabricatorConfig.paths, 'pages', []),
		fabricatorConfig.paths.data,
		fabricatorConfig.paths.docs,
		buildConfigInfoFile !== '' ? [buildConfigInfoFile] : []
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

function getFileName(filePath) {
	return _.reduce(
		filePath.split('/').pop(-1).split('.').slice(0, -1),
		function (result, piece) { return result + '.' + piece; });
}
