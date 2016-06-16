'use strict';

var _      = require('lodash');
var config = require('./config');
var fs     = require('fs');

module.exports.clearCache = function (callback) {

	if (config.toolkit.paths.toolkitConfig) {
		delete require.cache[require.resolve('../' + config.toolkit.paths.toolkitConfig)];
	}

	callback();
};

module.exports.generate = function (callback) {

	fs.writeFileSync(
		config.fabricator.paths.toolkitConfig,
		JSON.stringify(generateData()));

	callback();
};

function generateData() {

	var projectData = config.toolkit.paths.toolkitConfig
		? require('../' + config.toolkit.paths.toolkitConfig) 
		: {};

	return _(projectData)
		.set('toolkitScripts', _.keys(config.toolkit.paths.scripts))
		.set('toolkitStyles', _.keys(config.toolkit.paths.styles))
		.value();
}
