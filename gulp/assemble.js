
var _ = require('lodash');
var assemble = require('fabricator-assemble');


module.exports = function (gulp, plugins, config) {
	return function (callback) {
		
		assemble({
			logErrors: config.fabricator.dev,
			views    : config.fabricator.paths.views,
			materials: config.fabricator.paths.materials,

			// TODO: In the end, this could be constructed once in some init function!
			data     : _.union(config.fabricator.paths.data, [config.fabricator.paths.toolkitConfig]),

			docs     : config.fabricator.paths.docs,
			dest     : config.fabricator.paths.dest
		});
		
		callback();
	};
};
