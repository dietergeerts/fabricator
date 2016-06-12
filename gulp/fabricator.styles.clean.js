'use strict';

var config = require('./config');
var del    = require('del');

module.exports = function (callback) {
	del(config.fabricator.paths.dest.styles, {force: true}, callback);
};
