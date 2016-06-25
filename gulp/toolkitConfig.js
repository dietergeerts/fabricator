'use strict';

var _  = require('lodash');
var fs = require('fs');

module.exports = function (config) {

	var tasks = {};

	tasks.clearCache = function (callback) {

		if (config.toolkit.paths.toolkitConfig) {
			delete require.cache[require.resolve(config.getWorkingPath(config.toolkit.paths.toolkitConfig))];
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
			? require(config.getWorkingPath(config.toolkit.paths.toolkitConfig))
			: {};

		return _(projectData)
			.set('toolkitScripts', _.keys(config.toolkit.paths.scripts))
			.set('toolkitStyles', _.keys(config.toolkit.paths.styles))
			.value();
	}
};
