'use strict';

var _      = require('lodash');
var gutil  = require('gulp-util');
var config = require(gutil.env.config);

var dev = gutil.env.dev;
var dst = dev ? './dist' : config.dest;

module.exports.fabricator = {
	dev: dev,
	paths: {
		data: config.data,
		dest: {
			base  : dst,
			styles: dst + '/assets/fabricator/styles'
		},
		docs         : config.docs,
		materials    : config.materials,
		package      : config.package,
		styles       : './src/assets/styles/fabricator.scss',
		templates    : config.templates,
		toolkitConfig: './toolkitConfig.json',
		views        : ["./src/views/**/*", "!./src/views/+(layouts)/**"]

	}
};

module.exports.toolkit = {
	paths: {
		dest: {
			fonts : dst + '/assets/toolkit/fonts',
			styles: dst + '/assets/toolkit/styles'
		},
		fonts        : config.fonts,
		scripts      : config.scripts,
		styles       : config.styles,
		toolkitConfig: gutil.env.toolkitConfig
	}
};

module.exports.composeGlob = function () {
	return _(arguments).flatten().value();
};
