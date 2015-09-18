var gulp = require('gulp'),
    source = require('vinyl-source-stream'),
    buffer = require('gulp-buffer'),
    browserify = require('browserify');

gulp.task('client', [ 'client-js', 'client-html' ]);

gulp.task('client-js', function () {
  return browserify('client/js/main.js')
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(gulp.dest('dist'));
});

gulp.task('client-html', function () {
  return gulp.src('client/**/*.html')
    .pipe(gulp.dest('dist'));
});
