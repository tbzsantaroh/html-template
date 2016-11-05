var gulp     = require('gulp');
var plugins  = require('gulp-load-plugins')();
var notifier = require('node-notifier');

// header for top of dist files
var packageJSON = require('./package.json');

var banner = [
  '/*!',
  ' * Layzr.js <%= pkg.version %> - <%= pkg.description %>',
  ' * Copyright (c) 2015 <%= pkg.author %> - http://callmecavs.github.io/layzr.js/',
  ' * License: <%= pkg.license %>',
  ' */',
  '',
  ''].join('\n');

// error handler
// system notification, console log, emit end (so watch continues)
var onError = function(error) {
  notifier.notify({
    'title': 'Error',
    'message': 'Compilation failure.'
  });

  console.log(error);
  this.emit('end');
}

// concat and uglify scripts
gulp.task('scripts', function() {
  return gulp.src('src/layzr.js')
    .pipe(plugins.plumber({ errorHandler: onError }))
    .pipe(plugins.umd())
    .pipe(plugins.header(banner, { pkg: packageJSON }))
    .pipe(gulp.dest('dist'))
    .pipe(plugins.uglify({ preserveComments: 'some' }))
    .pipe(plugins.rename(function(path) {
      path.basename = "layzr.min"
    }))
    .pipe(gulp.dest('dist'));
});

// start local server on port 3000
gulp.task('server', function() {
  return plugins.connect.server({
    root: './',
    port: 3000,
    livereload: true
  });
});

// watch sass and js files
gulp.task('watch', function() {
  gulp.watch('src/layzr.js', ['scripts']);
});

// build and default task
gulp.task('default', ['server', 'scripts', 'watch']);
