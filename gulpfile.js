'use script';

var gulp = require('gulp');
var zip = require('gulp-zip');

gulp.task('default', ['dist']);

gulp.task('dist', function () {
    return gulp.src('checkbox@ganss.org/**/*')
        .pipe(zip('checkbox.xpi'))
        .pipe(gulp.dest('.'));
})
