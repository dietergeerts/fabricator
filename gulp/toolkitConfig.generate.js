
var _ = require('lodash');
var fs = require('fs');


module.exports = function (gulp, plugins, config) {
	return function (callback) {

		fs.writeFileSync(
			config.fabricator.paths.toolkitConfig,
			JSON.stringify(generateData(config)));

		callback();
	};
};


function generateData(config) {

	var projectData = config.toolkit.paths.toolkitConfig
		? require(config.toolkit.paths.toolkitConfig) 
		: {};

	var data =
		_(projectData)
			.set('toolkitScripts', _.keys(config.toolkit.paths.scripts))
			.set('toolkitStyles', _.keys(config.toolkit.paths.styles))
			.value();

	// TODO: This should be added in a different way, so we can plug it in if needed!
	var ngAppFile = _.get(config.fabricator.paths, 'ngAppFile', '');
	if (ngAppFile !== '') { data.ngAppName = getFileName(ngAppFile); }

	return data;
}


function getFileName(path) {
	return _.reduce(
		path.split('/').pop(-1).split('.').slice(0, -1),
		function (result, piece) {
			return result + '.' + piece;
		}
	);
}
