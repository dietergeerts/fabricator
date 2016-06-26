"use strict";

var _       = require('lodash');
var path    = require('path');
var webpack = require('webpack');

var defaults = {
	output: {filename: '[name].js'},
	module: {loaders: [{
		test: /\.js$/,
		exclude: /(node_modules|prism\.js)/,
		loaders: ['babel'],
		presets: ['es2015', 'stage-2']
	}]},
    resolveLoader: {
        root: path.join(__dirname, '..', 'node_modules')
    },
	plugins: [],
	cache: {}
};

module.exports = function (config) {

	var webpackConfig = {};

	if (!config.fabricator.dev) {
		defaults.plugins.push(new webpack.optimize.UglifyJsPlugin());
	}

	webpackConfig.fabricator = _.defaultsDeep({
		entry: {fabricator: config.fabricator.paths.scripts},
		output: {path: path.resolve(config.fabricator.paths.dest.scripts)}
	}, defaults);

	webpackConfig.toolkit = _.defaultsDeep({
		entry: config.toolkit.paths.scripts,
		output: {path: path.resolve(config.toolkit.paths.dest.scripts)}
	}, defaults);

	// Because webpackCompiler.watch() isn't being used, so
	// manually remove the changed file path from the cache.
	webpackConfig.cleanCache = function (options) {
		return function (e) {
			var keys = Object.keys(options.cache);
			var key, matchedKey;

			for (var keyIndex = 0; keyIndex < keys.length; keyIndex++) {
				key = keys[keyIndex];
				if (key.indexOf(e.path) !== -1) {
					matchedKey = key;
					break;
				}
			}

			if (matchedKey) {
				delete options.cache[matchedKey];
			}
		}
	};

	return webpackConfig;
};
