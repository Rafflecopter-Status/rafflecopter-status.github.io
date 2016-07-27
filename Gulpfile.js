var gulp = require('gulp'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnext = require('cssnext'),
    precss = require('precss'),
    pxtorem = require('postcss-pxtorem')
    hexrgba = require('postcss-hexrgba');


var src = {
  css: './style/'
}

gulp.task('css', function () {
  var processors = [
      autoprefixer,
      cssnext,
      precss,
      pxtorem,
      hexrgba
  ];
  return gulp.src(src.css + 'main.css')
      .pipe(postcss(processors))
      .pipe(gulp.dest('./out'));
});


gulp.task('watch', ['css'], function() {
  gulp.watch(src.css + '**/*.css', ['css'])
})