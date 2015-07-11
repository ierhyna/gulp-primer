'use strict';

var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    watch = require('gulp-watch'),
    del = require('del'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
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
    browserSync = require('browser-sync'),
    mainBowerFiles = require('main-bower-files'),
    filter = require('gulp-filter'),
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

// Browser Sync
var config = {
  server: {
    baseDir: "./dist"
  },
  tunnel: true,
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

// Images
gulp.task('image:build', function() {
  gulp.src(path.src.img)
    .pipe(plumber())
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
    .pipe(plumber())
    .pipe(gulp.dest(path.build.fonts))
});

// HTML
gulp.task('html:build', function() {
  gulp.src(path.src.html)
    .pipe(plumber())
    .pipe(rigger())
    .pipe(jade({pretty: true}))
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({stream: true}));
});

// Styles
gulp.task('style:build', function() {
  gulp.src(path.src.style)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cssmin())
    .pipe(sourcemaps.write('./maps'))
    .pipe(rename('style.css'))
    .pipe(gulp.dest(path.build.css))
    .pipe(reload({stream: true}));
});

// Scripts
gulp.task('js:build', function() {
  gulp.src(path.src.js)
    .pipe(plumber())
    .pipe(rigger())
    .pipe(sourcemaps.init())
    .pipe(coffee())
    .pipe(uglify())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({stream: true}));
});

// Vendors
var vendors = mainBowerFiles({
  includeDev: true,
  paths: {
    bowerDirectory: 'lib/',
    bowerrc: '.bowerrc',
    bowerJson: 'bower.json'
  }
});

gulp.task('scripts:vendor', function () {
  gulp.src(vendors)
    .pipe(plumber())
    .pipe(filter('**/*.js'))
    .pipe(uglify())
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(path.build.js))
});

gulp.task('styles:vendor', function () {
  gulp.src(vendors)
    .pipe(plumber())
    .pipe(filter('**/*.css'))
    .pipe(cssmin())
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest(path.build.css))
});

gulp.task('vendor', [
  'scripts:vendor',
  'styles:vendor'
]);

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
    gulp.start('html:build')
  });
  watch([path.watch.style], function(event, cb) {
    gulp.start('style:build')
  });
  watch([path.watch.js], function(event, cb) {
    gulp.start('js:build')
  });
  watch([path.watch.img], function(event, cb) {
    gulp.start('image:build')
  });
  watch([path.watch.fonts], function(event, cb) {
    gulp.start('fonts:build')
  });
});

// Default task
gulp.task('default', ['build', 'webserver', 'vendor', 'watch']);
