var gulp = require('gulp'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnext = require('cssnext'),
    precss = require('precss'),
    pxtorem = require('postcss-pxtorem'),
    hexrgba = require('postcss-hexrgba');
    math = require('postcss-math');


var src = {
  css: './style/'
}

gulp.task('css', function () {
  var processors = [
      cssnext,
      precss,
      pxtorem,
      hexrgba,
      math,
      autoprefixer
  ];
  return gulp.src(src.css + 'main.css')
      .pipe(postcss(processors))
      .pipe(gulp.dest('./out'));
});


gulp.task('watch', ['css'], function() {
  gulp.watch(src.css + '**/*.css', ['css'])
})