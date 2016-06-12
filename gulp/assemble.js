
var _ = require('lodash');
var fs = require('fs');
var assemble = require('fabricator-assemble');


module.exports = function (gulp, plugins, config) {
	return function (callback) {
		
		initializeBuildConfigInfo(config); // TODO: Refactor buildConfigInfo!
		
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

// TODO: buildConfigInfo should be done differently, with a .md or .hbs file!
// TODO: this also is in the assemble task!
function initializeBuildConfigInfo(config) {
	// Besides the use of toolkitConfig, it's possible to list info about these configurations on a
	// separate page. When buildConfigInfo is filled into the fabricatorConfig file, we'll add this page.
	// REMARK: Will be run before the actual assemble, as for watchers.

	var buildConfigInfoFile = _.get(config.fabricator.paths, 'buildConfigInfoFile', '');
	if (buildConfigInfoFile !== '') {
		delete require.cache[require.resolve(buildConfigInfoFile)];  // This changes by the user!
		fs.writeFileSync('./buildConfigInfo.json', JSON.stringify(require(buildConfigInfoFile)));
	}
}
