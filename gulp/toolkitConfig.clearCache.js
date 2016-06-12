
module.exports = function (gulp, plugins, config) {
	return function (callback) {

		if (config.toolkit.paths.toolkitConfig) {
			delete require.cache[require.resolve('../' + config.toolkit.paths.toolkitConfig)];
		}

		callback();
	};
};
