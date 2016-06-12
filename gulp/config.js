
var gutil  = require('gulp-util');
var config = require(gutil.env.config);

var dev = gutil.env.dev;
var dst = dev ? './dist' : config.dest;

module.exports.fabricator = {
	dev: dev,
	paths: {
		data: config.data,
		dest: {
			base  : dst,
			fonts : dst + '/assets/toolkit/fonts',
			styles: dst + '/assets/toolkit/styles'
		},
		docs: config.docs,
		materials: config.materials,
		// TODO: once ready, use this data path!
		// package: '../../package.json',
		package: './package.json',
		toolkitConfig: './toolkitConfig.json'
	}
};

module.exports.toolkit = {

};
