'use strict';

var _    = require('lodash');
var path = require('path');

module.exports = function (fabricatorConfig, dev) {

	var config = {};
    var dst = dev ? toFabricatorPath('./dist') : fabricatorConfig.dest;

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
			favicon      : toFabricatorPath('./src/assets/images/favicon.ico'),
            includes     : toFabricatorPath('./src/includes/**/*'),
            jscsrc       : toFabricatorPath('./.jscsrc'),
            jshintrc     : toFabricatorPath('./.jshintrc'),
            layouts      : toFabricatorPath('./src/layouts/**/*'),
			materials    : fabricatorConfig.materials,
			package      : fabricatorConfig.package,
			samples      : fabricatorConfig.samples,
            analyze      : toFabricatorPath('./src/assets/scripts/fabricator.js'),
            scripts      : toFabricatorPath('./src/assets/scripts/fabricator.js'),
			styles       : toFabricatorPath('./src/assets/styles/**/*.scss'),
			templates    : fabricatorConfig.templates,
			toolkitConfig: toFabricatorPath('./toolkitConfig.json'),
            tslint       : toFabricatorPath('./tslint.json'),
			views        : toFabricatorPath("./src/views/**/*")
		}
	};

	config.toolkit = {
        useWebpack: _.has(fabricatorConfig, 'useWebpack') ? fabricatorConfig.useWebpack : true,
        paths: {
            analyze: fabricatorConfig.analyze,
			dest   : {
				fonts  : path.join(dst, 'assets/toolkit/fonts'),
				icons  : path.join(dst, 'assets/toolkit/icons'),
				images : path.join(dst, 'assets/toolkit/images'),
				scripts: path.join(dst, 'assets/toolkit/scripts'),
				styles : path.join(dst, 'assets/toolkit/styles'),
                ts     : _.get(fabricatorConfig, 'typescript.dest', '')
			},
			fonts        : fabricatorConfig.fonts,
			icons        : fabricatorConfig.icons,
			images       : fabricatorConfig.images,
            jscsrc       : fabricatorConfig.jscsrc,
            jshintrc     : fabricatorConfig.jshintrc,
			scripts      : fabricatorConfig.scripts,
			styles       : fabricatorConfig.styles,
			toolkitConfig: fabricatorConfig.toolkitConfig,
            ts           : _.get(fabricatorConfig, 'typescript.comp', ''),
            tslint       : fabricatorConfig.tslint
		}
	};

	config.composeGlob = function () {
		return _(arguments).flatten().value();
	};

	return config;

    // Using this project as a node module requires us to work with absolute paths to stuff in here!
    // Node will always think './path' formats are from the calling node module! So be careful with this!
    function toFabricatorPath(filePath) {
        return path.normalize(path.join(__dirname, '..', filePath));
    }
};
