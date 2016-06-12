'use strict';

var assemble = require('fabricator-assemble');
var config   = require('./config');

module.exports = function (callback) {

	assemble({
		data: config.composeGlob(
			config.fabricator.paths.data,
			config.fabricator.paths.toolkitConfig
		),
		dest     : config.fabricator.paths.dest.base,
		docs     : config.fabricator.paths.docs,
		logErrors: config.fabricator.dev,
		materials: config.fabricator.paths.materials,
		views    : config.composeGlob(
			config.fabricator.paths.views,
			config.fabricator.paths.templates
		) 
	});

	callback();
};
