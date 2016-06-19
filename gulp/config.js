'use strict';

var _      = require('lodash');
var gutil  = require('gulp-util');
var config = require('../' + gutil.env.config);

var dev = gutil.env.dev;
var dst = dev ? './dist' : config.dest;

module.exports.fabricator = {
	dev: dev,
	paths: {
		data: config.data,
		dest: {
			base   : dst,
			images : dst + '/assets/fabricator/images',
			samples: dst + '/assets/samples',
			scripts: dst + '/assets/fabricator/scripts',
			styles : dst + '/assets/fabricator/styles'
		},
		docs         : config.docs,
		favicon      : './src/assets/images/favicon.ico',
		materials    : config.materials,
		package      : config.package,
		samples      : config.samples,
		scripts      : './src/assets/scripts/fabricator.js',
		styles       : './src/assets/styles/**/*.scss',
		templates    : config.templates,
		toolkitConfig: './toolkitConfig.json',
		views        : ["./src/views/**/*", "!./src/views/+(layouts)/**"]
	}
};

module.exports.toolkit = {
	paths: {
		dest: {
			fonts  : dst + '/assets/toolkit/fonts',
			images : dst + '/assets/toolkit/images',
			scripts: dst + '/assets/toolkit/scripts',
			styles : dst + '/assets/toolkit/styles'
		},
		fonts        : config.fonts,
		images       : config.images,
		scripts      : config.scripts,
		styles       : config.styles,
		toolkitConfig: gutil.env.toolkitConfig
	}
};

module.exports.composeGlob = function () {
	return _(arguments).flatten().value();
};
