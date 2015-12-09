'use strict';

<<<<<<< HEAD
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
=======
var
  gulp = require('gulp'),
  util = require('gulp-util'),
  ftp = require('vinyl-ftp'),
  rigger = require('gulp-rigger'),
  concat = require('gulp-concat'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  autoprefixer = require('gulp-autoprefixer'),
  uglify =  require('gulp-uglify'),
  minifyCss = require('gulp-minify-css'),
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant'),
  changed = require('gulp-changed'),
  watch = require('gulp-watch'),
  notify = require('gulp-notify'),
  del = require('del'),
  browserSync = require('browser-sync'),
  reload = browserSync.reload,
  production = !!util.env.production;

var path = {
  build: {
    html: 'dist',
    js: 'dist/js',
    style: 'dist/css',
    img: 'dist/img'
  },
  src: {
    html: 'html/*.html', 
    js: 'js/*.js',
    style: 'scss/*.scss',
    img: 'img/**/*.{jpg,jpeg,png,gif,svg}'
  },
  watch: {
    html: 'html/**/*.html', 
    js: 'js/*.js',
    style: 'scss/**/*.scss',
    img: 'img/**/*.{jpg,jpeg,png,gif,svg}'
  }
>>>>>>> d0aea0169f45c728ca49ebd4f07f9ff0a66d625c
};

// Browser Sync
var config = {
  server: {
<<<<<<< HEAD
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
=======
    baseDir: 'dist'
  },
  tunnel: false,
  host: 'localhost',
  port: 9090,
  logPrefix: 'Frontend_Devil'
};

gulp.task('webserver', function() {
  browserSync(config);
});

// Deploy via FTP
var ftpconf = {
  user: 'sokolovskaya',
  password: 'S2x3T0e7',
  host: 'skipodevelop.ru',
  port: 21,
  dist: ['./dist/**'],
  remote: '/kumar'
};

gulp.task('deploy', function() {
  var conn = ftp.create({
    host: ftpconf.host,
    port: ftpconf.port,
    user: ftpconf.user,
    password: ftpconf.password,
    parallel: 5,
    log: util.log
  });
  return gulp.src(ftpconf.dist, {base: './dist/', buffer: false})
    .pipe(conn.newer(ftpconf.remote)) // only upload newer files 
    .pipe(conn.dest(ftpconf.remote));
>>>>>>> d0aea0169f45c728ca49ebd4f07f9ff0a66d625c
});

// HTML
gulp.task('html:build', function() {
  gulp.src(path.src.html)
<<<<<<< HEAD
=======
    //.pipe(changed(path.build.html)) // only build changed files
    .pipe(rigger())
    .pipe(gulp.dest(path.build.html))
>>>>>>> d0aea0169f45c728ca49ebd4f07f9ff0a66d625c
    .pipe(reload({stream: true}));
});

// Styles
gulp.task('style:build', function() {
  gulp.src(path.src.style)
<<<<<<< HEAD
    .pipe(sass( {errLogToConsole: true} ))
    .pipe(autoprefixer())
    .pipe(cssmin())
    .pipe(rename('style.css'))
    .pipe(gulp.dest(path.build.css))
=======
    .pipe(sourcemaps.init())
    //.pipe(sass().on('error', sass.logError)) // default error handler
    .pipe(sass().on('error', notify.onError({
      title: 'SCSS error (in line <%= error.line %>)',
      message: '<%= error.message %>'
    })))
    .pipe(autoprefixer())
    .pipe(production ? minifyCss({keepSpecialComments : 0}) : util.noop())
    .pipe(!production ? sourcemaps.write() : util.noop())
    .pipe(gulp.dest(path.build.style))
>>>>>>> d0aea0169f45c728ca49ebd4f07f9ff0a66d625c
    .pipe(reload({stream: true}));
});

// Scripts
gulp.task('js:build', function() {
  gulp.src(path.src.js)
<<<<<<< HEAD
    // .pipe(uglify())
    // .pipe(gulp.dest(path.build.js))
    .pipe(reload({stream: true}));
});

=======
    .pipe(production ? uglify().on('error', notify.onError({
      title: 'JS error',
      message: '<%= error.message %>'
    })) : util.noop())
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({stream: true}));
});

// Copy depencencies to vendor
gulp.task('js:vendor', function() {
  return gulp.src([
    './bower_components/jquery/dist/jquery.js',
  ])
  .pipe(uglify())
  .pipe(concat('vendor.js'))
  .pipe(gulp.dest(path.build.js));
});

// Images
gulp.task('images', function() {
  gulp.src(path.src.img)
    .pipe(changed(path.build.img)) // only build changed files
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(path.build.img));
});

// Fonts
gulp.task('fonts', function() {
  gulp.src('./fonts/**/*.{ttf,woff,woff2,eof,svg}')
  .pipe(changed('./dist/fonts')) // only build changed files
  .pipe(gulp.dest('./dist/fonts'));
});

// Clean for production
gulp.task('clean', function() {
  production ? del('dist/*') : util.noop();
});

>>>>>>> d0aea0169f45c728ca49ebd4f07f9ff0a66d625c
// Create dist
gulp.task('build', [
  'html:build',
  'js:build',
<<<<<<< HEAD
  'style:build'
=======
  'style:build',
  'js:vendor',
  'fonts',
  'images'
>>>>>>> d0aea0169f45c728ca49ebd4f07f9ff0a66d625c
]);

// Watch
gulp.task('watch', function(){
  watch([path.watch.html], function(event, cb) {
<<<<<<< HEAD
    gulp.start('html:build')
  });
  watch([path.watch.style], function(event, cb) {
    gulp.start('style:build')
  });
  watch([path.watch.js], function(event, cb) {
    gulp.start('js:build')
=======
    gulp.start('html:build');
  });
  watch([path.watch.style], function(event, cb) {
    gulp.start('style:build');
  });
  watch([path.watch.js], function(event, cb) {
    gulp.start('js:build');
  });
  watch([path.watch.img], function(event, cb) {
    gulp.start('images:min');
>>>>>>> d0aea0169f45c728ca49ebd4f07f9ff0a66d625c
  });
});

// Default task
<<<<<<< HEAD
gulp.task('default', ['build', 'webserver', 'watch']);

=======
gulp.task('default', ['build', 'watch', 'webserver']);
>>>>>>> d0aea0169f45c728ca49ebd4f07f9ff0a66d625c
