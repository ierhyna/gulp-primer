'use strict';

var gulp = require('gulp'),
    rename = require('gulp-rename'),
    del = require('del'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    watch = require('gulp-watch'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

var path = {
  build: {
    // js: 'dist/js/'
    css: 'stylesheets/'
  },
  src: {
    html: './*.html', 
    js: 'js/*.js',
    style: 'sass/*.scss'
  },
  watch: {
    html: './*.html', 
    js: 'js/*.js',
    style: 'sass/**/*.scss'
  },
  clean: './stylesheets/*'
};

// Browser Sync
var config = {
  server: {
    baseDir: "./"
  },
  tunnel: false,
  host: 'localhost',
  port: 9000,
  logPrefix: "Frontend_Devil"
};

gulp.task('webserver', function() {
    browserSync(config);
});

// Clean
gulp.task('clean', function(cb) {
  del(path.clean, cb)
});

// HTML
gulp.task('html:build', function() {
  gulp.src(path.src.html)
    .pipe(reload({stream: true}));
});

// Styles
gulp.task('style:build', function() {
  gulp.src(path.src.style)
    .pipe(sass( {errLogToConsole: true} ))
    .pipe(autoprefixer())
    .pipe(cssmin())
    .pipe(rename('style.css'))
    .pipe(gulp.dest(path.build.css))
    .pipe(reload({stream: true}));
});

// Scripts
gulp.task('js:build', function() {
  gulp.src(path.src.js)
    // .pipe(uglify())
    // .pipe(gulp.dest(path.build.js))
    .pipe(reload({stream: true}));
});

// Create dist
gulp.task('build', [
  'html:build',
  'js:build',
  'style:build'
]);

// Watch
gulp.task('watch', function(){
  watch([path.watch.html], function(event, cb) {
    gulp.start('html:build')
  });
  watch([path.watch.style], function(event, cb) {
    gulp.start('style:build')
  });
  watch([path.watch.js], function(event, cb) {
    gulp.start('js:build')
  });
});

// Default task
gulp.task('default', ['build', 'webserver', 'watch']);

