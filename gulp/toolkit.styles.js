
var _ = require('lodash');
var merge = require('merge2');


module.exports = function (gulp, plugins, config) {
	return function () {

		var styleReplacements = config.toolkit.paths.toolkitConfig
			? generateStyleReplacements(config.toolkit.paths.toolkitConfig)
			: {};

		return merge(_(config.toolkit.paths.styles).pairs().map(createStyleStream).value());

		function createStyleStream(namedSrc) {
			return gulp.src(namedSrc[1])
				.pipe(plugins.sourcemaps.init())
				.pipe(plugins.replaceTask({patterns: [{json: styleReplacements}], usePrefix: false}))
				.pipe(plugins.sass().on('error', plugins.sass.logError))
				.pipe(plugins.autoprefixer('last 1 version'))
				.pipe(plugins.if(!config.fabricator.dev, plugins.csso()))
				.pipe(plugins.concat(namedSrc[0] + '.css'))
				.pipe(plugins.sourcemaps.write())
				.pipe(gulp.dest(config.fabricator.paths.dest + config.fabricator.paths.dest_styles));
		}
	};
};

function generateStyleReplacements(path) {

	return fillWithDataAndReturn({}, require('../' + path));

	function fillWithDataAndReturn(replacements, data) {
		
		_.forOwn(data, function (value, key) {
			
			if (_.isObject(value)) {
				fillWithDataAndReturn(replacements, value);
			} else {
				replacements['/* ' + key + ' */'] = key + ': ' + value + ' !default;';
			}
		});
		
		return replacements;
	}
}
