const gulp = require('gulp');
const watch = require('gulp-watch');
const browserSync = require('browser-sync');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer');

const PATH = {
  src: {
    css: './src/scss/*.scss', // Only first-level files
    js: './src/js/*.js',
    html: './src/*.html'
  },
  dest: {
    css: './dist/css',
    js: './dist/js',
    html: './dist'
  },
  watch: {
    css: './src/scss/**/*.scss', // Include files from subfolder
    js: './src/js/*.js',
    html: './src/*.html'
  }
};

// Browser Sync
gulp.task('SERVER', () => browserSync({
  server: './dist'
  // tunnel: true,
  // proxy: 'localhost:9000',
  // port: 9090
}));

// Styles
gulp.task('CSS', () => gulp.src(PATH.src.css)
  .pipe(sourcemaps.init())
  .pipe(sass())
  .pipe(postcss([
    autoprefixer({ browsers: ['last 2 versions'] })
  ]))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(PATH.dest.css))
  .pipe(browserSync.reload({ stream: true })));

// Scripts
gulp.task('JS', () => gulp.src(PATH.src.js)
  .pipe(sourcemaps.init())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(PATH.dest.js))
  .pipe(browserSync.reload({ stream: true })));

// HTML
gulp.task('HTML', () => gulp.src(PATH.src.html)
  .pipe(gulp.dest(PATH.dest.html)) // Just copy html files to dest/
  .pipe(browserSync.reload({ stream: true })));

// Watch
gulp.task('WATCH', () => {
  watch([PATH.watch.css], () => {
    gulp.start('CSS');
  });

  watch([PATH.watch.js], () => {
    gulp.start('JS');
  });

  watch([PATH.watch.html], () => {
    gulp.start('HTML');
  });
});

// Build
gulp.task('BUILD', [
  'CSS',
  'JS',
  'HTML'
]);

// Default task
gulp.task('default', ['BUILD', 'WATCH', 'SERVER']);
