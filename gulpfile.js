'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    del = require('rimraf'),
    rename = require('gulp-rename'), // not used
    concat = require('gulp-concat'), // not used
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    jade = require('gulp-jade'),
    coffee = require('gulp-coffee'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

var path = {
  build: {
    html: 'dist/',
    js: 'dist/js/',
    css: 'dist/css/',
    img: 'dist/img/',
    fonts: 'dist/fonts/'
  },
  src: {
    html: 'assets/jade/*.jade', 
    js: 'assets/coffee/main.coffee',
    style: 'assets/scss/main.scss',
    img: 'assets/img/**/*.*',
    fonts: 'assets/fonts/**/*.*'
  },
  watch: {
    html: 'assets/jade/*.jade',
    js: 'assets/coffee/**/*.js',
    style: 'assets/scss/**/*.scss',
    img: 'assets/img/**/*.*',
    fonts: 'assets/fonts/**/*.*'
  },
  clean: './dist'
};

var config = {
  server: {
    baseDir: "./dist"
  },
  tunnel: true,
  host: 'localhost',
  port: 9000,
  logPrefix: "Frontend_Devil"
};

// Browser Sync
gulp.task('webserver', function() {
    browserSync(config);
});

// Clean
gulp.task('clean', function(cb) {
  del(path.clean, cb)
});

// Images
gulp.task('image:build', function() {
  gulp.src(path.src.img)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()],
      interlaced: true
    }))
    .pipe(gulp.dest(path.build.img))
    .pipe(reload({stream: true}));
});

// Fonts
gulp.task('fonts:build', function() {
  gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts))
});

// HTML
gulp.task('html:build', function() {
  gulp.src(path.src.html)
    .pipe(rigger())
    .pipe(jade({pretty: true}))
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({stream: true}));
});

// Styles
gulp.task('style:build', function() {
  gulp.src(path.src.style)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cssmin())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.css))
    .pipe(reload({stream: true}));
});

// Scripts
gulp.task('js:build', function() {
  gulp.src(path.src.js)
    .pipe(rigger())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({stream: true}));
});

// Create dist
gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build'
]);

// Watch
gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});

// Default task
gulp.task('default', ['build', 'webserver', 'watch']);