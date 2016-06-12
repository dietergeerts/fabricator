
var del = require('del');


module.exports = function (gulp, plugins, config) {
	return function (callback) {
		del(config.fabricator.paths.dest.styles, {force: true}, callback);
	};
};
