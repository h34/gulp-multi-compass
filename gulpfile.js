var gulp = require('gulp');
var multiCompass = require('./index');


gulp.task('compile',function(){
  gulp.src('./src/**/*.scss')
    .pipe(multiCompass({sass:'src', css:'dest'}))
    //.pipe( gulp.dest('dest') );
})