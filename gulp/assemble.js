'use strict';

var _        = require('lodash');
var assemble = require('fabricator-assemble');
var helpers  = flattenHelpers(require('handlebars-helpers/lib/'));

module.exports = function (config) {

	var tasks = {};

	tasks.run = function (callback) {

		assemble({
			data: config.composeGlob(
				config.fabricator.paths.data,
				config.fabricator.paths.toolkitConfig,
				config.fabricator.paths.package
			),
			dest          : config.fabricator.paths.dest.base,
			docs          : config.fabricator.paths.docs,
            layouts       : config.fabricator.paths.layouts,
            layoutIncludes: config.fabricator.paths.includes,
			logErrors     : config.fabricator.dev,
			materials     : config.fabricator.paths.materials,
			views         : config.composeGlob(
				config.fabricator.paths.views,
				config.fabricator.paths.templates
			),
            helpers: helpers
		});

		callback();
	};

    return tasks;
};

function flattenHelpers(helpers) {
    return _(helpers)
        .toPairs()
        .map(function (helperGroup) {
            return _(helperGroup[1])
                .toPairs()
                .value();
        })
        .flatten()
        .fromPairs()
        .value();
}
