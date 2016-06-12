'use strict';

var config = require('./config');

module.exports = function (callback) {

	if (config.toolkit.paths.toolkitConfig) {
		delete require.cache[require.resolve('../' + config.toolkit.paths.toolkitConfig)];
	}

	callback();
};
