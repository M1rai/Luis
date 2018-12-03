const gulp = require('gulp');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const prettier = require('gulp-prettier');
const shorthand = require('gulp-shorthand');
const uncss = require('postcss-uncss');
const postcss = require('gulp-postcss');
const browserSync = require('browser-sync').create();
const del = require("del");
const run = require("run-sequence");
    

gulp.task('sass', function () {
    return gulp.src('scss/main.scss')
        .pipe(plumber())
        .pipe(sass()) // Компиляция sass в css
        .pipe(autoprefixer({
          browsers: ['last 2 version']
        }))
        .pipe(shorthand()) // Делае м css читаемым
        .pipe(prettier({ singleQuote: true })) // Красивый код css
        .pipe(gulp.dest('build/css'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('html', function () {
  return gulp.src('*.html')
      .pipe(gulp.dest('build'))
      .pipe(browserSync.reload({stream: true}));
});

gulp.task('js', function () {
  return gulp.src('js/**/*.js')
      .pipe(gulp.dest('build/js'))
      .pipe(browserSync.reload({stream: true}));
});

gulp.task('css', function () {
  return gulp.src('css/**/*.css')
      .pipe(gulp.dest('build/css'))
      .pipe(browserSync.reload({stream: true}));
});

gulp.task('allimg', function () {
  return gulp.src('img/**/*.{png,jpg}')
      .pipe(gulp.dest('build/img'))
      .pipe(browserSync.reload({stream: true}));
});

gulp.task('serve', function () {
  browserSync.init({
    server: "build"
  });

  gulp.watch("scss/**/*.scss", ["sass"]);
  gulp.watch("*.html", ["html"]);
  gulp.watch("js/**/*.js", ["js"]);
  gulp.watch("css/**/*.css", ["css"]);
  gulp.watch("img/**/*.{png,jpg}", ["allimg"]);
  gulp.watch("img/**/*.{svg}", ["svg"]);
});

gulp.task('copy', function () {
  return gulp.src([
    'img/**',
    'js/**',
    'css/**',
    '*.html'
  ], {
    base: '.'
  })
      .pipe(gulp.dest('build'));

});

gulp.task('clean', function () {
  return del('build');
});

gulp.task('build', function (fn) {
  run(
      'clean',
      'copy',
      'sass',
      'allimg',
      fn
  );
});