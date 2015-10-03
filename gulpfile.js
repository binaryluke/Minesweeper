var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');

gulp.task('jshint', function () {
  return gulp.src(['src/**', 'test/**'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('build', function () {
  return gulp.src(['src/**.js'])
    .pipe(gulp.dest('dist'));
});

gulp.task('compress', ['build'], function () {
  return gulp.src(['dist/**.js', '!dist/**.min.js'])
    .pipe(uglify({ preserveComments: 'license' }))
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('mocha', function() {
    return gulp.src(['test/*.js'], { read: false })
        .pipe(mocha({ reporter: 'list' }))
        .on('error', gutil.log);
});

gulp.task('watch', function() {
    gulp.watch(['src/**', 'test/**'], ['jshint', 'mocha']);
});

gulp.task('default', ['jshint', 'mocha', 'build', 'compress']);