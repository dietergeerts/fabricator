"use strict";

var _       = require('lodash');
var gutil   = require('gulp-util');
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
	plugins: [],
	cache: {}
};

module.exports = function (config) {

	var tasks = {};

	if (!config.fabricator.dev) {
		defaults.plugins.push(new webpack.optimize.UglifyJsPlugin());
	}

	tasks.fabricator = _.defaultsDeep({
		entry: {fabricator: config.fabricator.paths.scripts},
		output: {path: path.resolve(config.getWorkingPath(config.fabricator.paths.dest.scripts))}
	}, defaults);

	tasks.toolkit = _.defaultsDeep({
		entry: config.toolkit.paths.scripts,
		output: {path: path.resolve(config.getWorkingPath(config.toolkit.paths.dest.scripts))}
	}, defaults);

	tasks.compile = function (options) {
		return function (callback) {
			webpack(options).run(function (error, result) {

				if (error) {
					logError(error);
				}

				result = result.toJson();
				if (result.errors.length) {
					result.errors.forEach(logError);
				}

				callback();
			});

			function logError(error) {
				gutil.log(gutil.colors.red(error));
			}
		};
	};

	// Because webpackCompiler.watch() isn't being used, so
	// manually remove the changed file path from the cache.
	tasks.cleanCache = function (options) {
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

	return tasks;
};
