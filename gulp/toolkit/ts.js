'use strict';

var del     = require('del');
var gulp    = require('gulp');
var ts      = require('gulp-typescript');

module.exports = function (config) {

	var tasks = {};

	tasks.clean = function () {
		return del(config.toolkit.paths.dest.ts, {force: true});
	};

    tasks.run = function () {
        return gulp.src(config.toolkit.paths.ts)
            .pipe(ts({
                "emitDecoratorMetadata": true,
                "experimentalDecorators": true,
                "target": "es5",
                "module": "commonjs",
                "moduleResolution": "node",
                "removeComments": true,
                "sourceMap": true,
                "declaration": true
            }))
            .pipe(gulp.dest(config.toolkit.paths.dest.ts));
	};

	return tasks;
};
