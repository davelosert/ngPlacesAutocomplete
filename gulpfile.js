'use strict';
/**
 * Created by David on 05.10.14.
 */

var gulp = require('gulp')
	, plugins = require('gulp-load-plugins')();


gulp.task('default', function () {
	return gulp.src('ngPlacesAutocomplete.js')
		.pipe(plugins.ngmin({dynamic: true}))
		.pipe(plugins.uglify())
		.pipe(plugins.rename({suffix: '.min'}))
		.pipe(gulp.dest('./'));
});