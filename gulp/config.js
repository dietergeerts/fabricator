'use strict';

var _      = require('lodash');
var gutil  = require('gulp-util');

module.exports = function (fabricatorConfig) {

	var config = {};
	var dev = gutil.env.dev;
	var dst = dev ? './dist' : fabricatorConfig.dest;

	config.fabricator = {
		dev: dev,
		paths: {
			data: fabricatorConfig.data,
			dest: {
				base   : dst,
				images : dst + '/assets/fabricator/images',
				samples: dst + '/assets/samples',
				scripts: dst + '/assets/fabricator/scripts',
				styles : dst + '/assets/fabricator/styles'
			},
			docs         : fabricatorConfig.docs,
			favicon      : './src/assets/images/favicon.ico',
			materials    : fabricatorConfig.materials,
			package      : fabricatorConfig.package,
			samples      : fabricatorConfig.samples,
			scripts      : './src/assets/scripts/fabricator.js',
			styles       : './src/assets/styles/**/*.scss',
			templates    : fabricatorConfig.templates,
			toolkitConfig: './toolkitConfig.json',
			views        : ["./src/views/**/*", "!./src/views/+(layouts)/**"]
		}
	};

	config.toolkit = {
		paths: {
			dest: {
				fonts  : dst + '/assets/toolkit/fonts',
				images : dst + '/assets/toolkit/images',
				scripts: dst + '/assets/toolkit/scripts',
				styles : dst + '/assets/toolkit/styles'
			},
			fonts        : fabricatorConfig.fonts,
			images       : fabricatorConfig.images,
			scripts      : fabricatorConfig.scripts,
			styles       : fabricatorConfig.styles,
			toolkitConfig: fabricatorConfig.toolkitConfig
		}
	};

	config.composeGlob = function () {
		return _(arguments).flatten().value();
	};

	return config;
};
