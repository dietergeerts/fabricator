'use strict';

var _    = require('lodash');
var fs   = require('fs');
var path = require('path');

module.exports = function (config) {

	var tasks = {};

	tasks.clearCache = function (callback) {

		if (config.toolkit.paths.toolkitConfig) {
			delete require.cache[require.resolve(path.resolve(config.toolkit.paths.toolkitConfig))];
		}

		callback();
	};

	tasks.generate = function (callback) {

		fs.writeFileSync(
			config.fabricator.paths.toolkitConfig,
			JSON.stringify(generateData()));

		callback();
	};

	return tasks;

	function generateData() {

		var projectData = config.toolkit.paths.toolkitConfig
			? require(path.resolve(config.toolkit.paths.toolkitConfig))
			: {};

		return _(projectData)
			.set('toolkitScripts', _.keys(config.toolkit.paths.scripts))
			.set('toolkitStyles', _.keys(config.toolkit.paths.styles))
			.value();
	}
};
