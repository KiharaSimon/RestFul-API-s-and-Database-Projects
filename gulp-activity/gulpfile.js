const gulp = require('gulp');
const jshint = require('gulp-jshint');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const runSequence = require('gulp4-run-sequence');
const browserSync = require('browser-sync').create();

gulp.task('copyImages', function() {
   gulp.src(['images/**/*.{gif,jpg,png,svg}'])
       .pipe(gulp.dest('dist/images'));
 });

gulp.task('processHTML', async () => {
 gulp.src('*.html')
  .pipe(gulp.dest('dist'));
});

gulp.task('processJS', async () => {
  gulp.src('*.js')
    .pipe(jshint({
      esversion: 9
    }))
    .pipe(jshint.reporter('default'))
    .pipe(babel({
      presets: ["@babel/preset-env"]
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('babelPolyfill', async () => {
  gulp.src('node_modules/babel-polyfill/browser.js')
    .pipe(gulp.dest('dist/node_modules/babel-polyfill'));
});

gulp.task('watch', function(){
  gulp.watch('*.html', gulp.series(['processHTML']));
  gulp.watch('*.js', gulp.series(['processJS']));

  gulp.watch("dist/*.html").on('change', browserSync.reload);
  gulp.watch("dist/*.js").on('change', browserSync.reload);
});

gulp.task('serve', function () {
   browserSync.init({
   server: './dist',
   port: 8080,
   ui: {
     port: 8081
   }
 });
});

gulp.task('default', async (callback) => {
  runSequence(['copyImages','processHTML', 'processJS', 'babelPolyfill', 'watch', 'serve'], callback);
});
