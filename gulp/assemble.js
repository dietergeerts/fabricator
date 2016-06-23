'use strict';

var assemble = require('fabricator-assemble');

module.exports = function (config) {
	
	var tasks = {};

	tasks.run = function (callback) {

		assemble({
			data: config.composeGlob(
				config.fabricator.paths.data,
				config.fabricator.paths.toolkitConfig,
				config.fabricator.paths.package
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

	return tasks;
};
