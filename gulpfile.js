var gulp = require('gulp');
var multiCompass = require('./index');


gulp.task('compile',function(){
  gulp.src('./src/**/*.scss')
    .pipe(multiCompass())
    .pipe( gulp.dest('dest') );
})