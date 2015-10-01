var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');

gulp.task('jshint', function () {
  return gulp.src(['src/**', 'test/**'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('mocha', function() {
    return gulp.src(['test/*.js'], { read: false })
        .pipe(mocha({ reporter: 'list' }))
        .on('error', gutil.log);
});

gulp.task('watch', function() {
    gulp.watch(['src/**', 'test/**'], ['jshint', 'mocha']);
});

gulp.task('default', ['jshint', 'mocha']);