'use strict';

var config  = require('./../config');
var del     = require('del');
var webpack = require('./../webpack');

module.exports.clean = function (callback) {
	del(config.toolkit.paths.dest.scripts, {force: true}, callback);
};

module.exports.run = function (callback) {
	return webpack.compile(webpack.toolkit)(callback);
};
