var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    sass = require('gulp-sass'),
    jade = require('gulp-jade'),
    bowerFiles = require('gulp-bower-files'),
    del = require('del'),
    browserSync = require('browser-sync');

var path = {
  jade: 'assets/jade',
  scss: 'assets/scss',
  coffee: 'assets/coffee',
  images: 'assets/images',

  html: 'dist/',
  css: 'dist/css',
  js: 'dist/js',
  img: 'dist/img',

  www: 'dist/'
};

var watched = {
  jade: path.jade + '/**/*.jade',
  scss: path.scss + '/**/*.scss',
  coffee: path.coffee + '/**/*.coffee',
  img: path.images + '/*'
};

// Browser Sync
gulp.task('browser-sync', function() {
  browserSync({
    server: {
       baseDir: path.www
    }
  });
});

gulp.task('bs-reload', function() {
  browserSync.reload();
});

// Bower
gulp.task('bower', function(){
  return bowerFiles()
    .pipe(filter('**/*.js'))
    .pipe(concat(parameters.bower_main_file))
    .pipe(gulp.dest(parameters.web_path + '/js'))
    .on('error', gutil.log);
});

// Images
gulp.task('images', function(){
  gulp.src(watched.img)
    .pipe(imagemin({
      progressive: true
    }))
    .pipe(gulp.dest(path.img));
});

// HTML
gulp.task('jade', function() {
  gulp.src(watched.jade)
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(jade({pretty: true}))
    .pipe(gulp.dest(path.html))
    .pipe(browserSync.reload({
      stream:true
    }));
});

// Styles
gulp.task('styles', function(){
  gulp.src(watched.scss)
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest(path.css))
    .pipe(browserSync.reload({stream:true}))
});

// Scripts
gulp.task('scripts', function(){
  return gulp.src(watched.coffee)
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(coffee({bare: true}))
    .pipe(concat('main.js'))
    .pipe(gulp.dest(path.js))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(path.js))
    .pipe(browserSync.reload({stream:true}))
});

// Clean
gulp.task('clean', function(cb) {
  del([path.www + '/*'], cb)
});

// Create dist
gulp.task('dist', ['clean'], function() {
  gulp.start('jade', 'styles', 'scripts', 'images');
});

// Watch
gulp.task('default', ['browser-sync'], function() {
  gulp.watch(watched.jade, ['jade']);
  //gulp.watch('assets/libs/normalize.css/*.css', ['normalize']);
  gulp.watch(watched.scss, ['styles']);
  gulp.watch(watched.coffee, ['scripts']);
});
