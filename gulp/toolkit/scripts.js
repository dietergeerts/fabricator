'use strict';

var del = require('del');

module.exports = function (config, webpack) {
	
	var tasks = {};

	tasks.clean = function (callback) {
		del(config.toolkit.paths.dest.scripts, {force: true}, callback);
	};

	tasks.run = function (callback) {
		return webpack.compile(webpack.toolkit)(callback);
	};

	return tasks;
};
