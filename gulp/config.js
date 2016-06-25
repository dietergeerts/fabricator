'use strict';

var _    = require('lodash');
var path = require('path');

module.exports = function (fabricatorConfig, dev) {

	var config = {};

    // Using this project as a node module requires us to work with absolute paths to stuff in here!
    // Node will always think './path' formats are from the calling node module! So be careful with this!
    config.toFabricatorPath = function (filePath) {
        return path.normalize(path.join(__dirname, '..', filePath));
    };

    var dst = dev ? config.toFabricatorPath('./dist') : fabricatorConfig.dest;

	config.fabricator = {
		dev: dev,
		paths: {
			data: fabricatorConfig.data,
			dest: {
				base   : dst,
				images : path.join(dst, 'assets/fabricator/images'),
				samples: path.join(dst, 'assets/samples'),
				scripts: path.join(dst, 'assets/fabricator/scripts'),
				styles : path.join(dst, 'assets/fabricator/styles')
			},
			docs         : fabricatorConfig.docs,
			favicon      : config.toFabricatorPath('./src/assets/images/favicon.ico'),
            jscsrc       : config.toFabricatorPath('./.jscsrc'),
            jshintrc     : config.toFabricatorPath('./.jshintrc'),
			materials    : fabricatorConfig.materials,
			package      : fabricatorConfig.package,
			samples      : fabricatorConfig.samples,
			scripts      : config.toFabricatorPath('./src/assets/scripts/fabricator.js'),
			styles       : config.toFabricatorPath('./src/assets/styles/**/*.scss'),
			templates    : fabricatorConfig.templates,
			toolkitConfig: config.toFabricatorPath('./toolkitConfig.json'),
			views        : [
                config.toFabricatorPath("./src/views/**/*"),
                "!" + config.toFabricatorPath("./src/views/+(layouts)/**")
            ]
		}
	};

	config.toolkit = {
		paths: {
			dest: {
				fonts  : path.join(dst, 'assets/toolkit/fonts'),
				images : path.join(dst, 'assets/toolkit/images'),
				scripts: path.join(dst, 'assets/toolkit/scripts'),
				styles : path.join(dst, 'assets/toolkit/styles')
			},
			fonts        : fabricatorConfig.fonts,
			images       : fabricatorConfig.images,
            jscsrc       : fabricatorConfig.jscsrc,
            jshintrc     : fabricatorConfig.jshintrc,
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
