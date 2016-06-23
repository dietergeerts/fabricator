'use strict';

var del = require('del');

module.exports = function (config, webpack) {
	
	var tasks = {};

	tasks.clean = function (callback) {
		del(config.fabricator.paths.dest.scripts, {force: true}, callback);
	};

	tasks.run = function (callback) {
		return webpack.compile(webpack.fabricator)(callback);
	};

	return tasks;
};
