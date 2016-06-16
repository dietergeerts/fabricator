'use strict';

var config  = require('./../config');
var del     = require('del');
var webpack = require('./../webpack');

module.exports.clean = function (callback) {
	del(config.fabricator.paths.dest.scripts, {force: true}, callback);
};

module.exports.run = function (callback) {
	return webpack.compile(webpack.fabricator)(callback);
};
