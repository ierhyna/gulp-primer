'use strict';

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
};

// Browser Sync
var config = {
  server: {
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
  user: 'user',
  password: 'password',
  host: 'host',
  port: 21,
  dist: ['./dist/**'],
  remote: '/'
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
});

// HTML
gulp.task('html:build', function() {
  gulp.src(path.src.html)
    //.pipe(changed(path.build.html)) // only build changed files
    .pipe(rigger())
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({stream: true}));
});

// Styles
gulp.task('style:build', function() {
  gulp.src(path.src.style)
    .pipe(sourcemaps.init())
    //.pipe(sass().on('error', sass.logError)) // default error handler
    .pipe(sass().on('error', notify.onError({
      title: 'SCSS error (in line <%= error.line %>)',  // delete spaces
      message: '<%= error.message %>'  // delete spaces
    })))
    .pipe(autoprefixer())
    .pipe(production ? minifyCss({keepSpecialComments : 0}) : util.noop())
    .pipe(!production ? sourcemaps.write() : util.noop())
    .pipe(gulp.dest(path.build.style))
    .pipe(reload({stream: true}));
});

// Scripts
gulp.task('js:build', function() {
  gulp.src(path.src.js)
    .pipe(production ? uglify().on('error', notify.onError({
      title: 'JS error',
      message: '<%= error.message %>' // delete spaces
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

// Create dist
gulp.task('build', [
  'html:build',
  'js:build',
  'style:build',
  'js:vendor',
  'fonts',
  'images'
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
    gulp.start('images');
  });
});

// Default task
gulp.task('default', ['build', 'watch', 'webserver']);
