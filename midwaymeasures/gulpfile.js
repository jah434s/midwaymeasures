/// <vs BeforeBuild='compileSass' SolutionOpened='watch' />
var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var minifyCSS = require('gulp-minify-css');

gulp.task('compileSass', function () {
    gulp.src('./content/scss/**/*.scss')
        .pipe(sass({ sourcemap: true }))
        .on('error', function(error) {
            console.error(error);
            this.emit('end');
        })
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(minifyCSS({ compatibility: 'ie8' }))
        .pipe(sourcemaps.write('../css'))
        .pipe(gulp.dest('./content/css'));
});

gulp.task('watch', function () {
    gulp.watch('./content/scss/**/*.scss', ['compileSass']);
});