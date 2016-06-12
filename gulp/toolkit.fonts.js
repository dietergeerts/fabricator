
module.exports = function (gulp, plugins, config) {
	return function () {
		return gulp.src(config.toolkit.paths.fonts)
			.pipe(gulp.dest(config.fabricator.paths.dest.fonts));
	};
};
