var gulp = require('gulp');
var browserify = require('gulp-browserify');
var watchify = require('gulp-watchify');
var react = require('react-tools');
var uglify = require('gulp-uglify');

gulp.task('scripts', function() {
    // Single entry point to browserify
    
    gulp.src('./public/src/main.js')
        .pipe(browserify({
            insertGlobals : true,
            debug: true
        }))
        .pipe(gulp.dest('./public/build'))
 
});


var watching = false;
gulp.task('enable-watch-mode', function(){
   watching = true; 
});

gulp.task('browserify', watchify(function(watchify) {
    // Single entry point to browserify
    return gulp.src('./public/src/main.js')
        .pipe(watchify({
            watching : watching,
            insertGlobals : true,
            debug: true
        }))
        .pipe(gulp.dest('./public/build'))
 
}));


gulp.task('browserify-min', function() {
    // Single entry point to browserify
    return gulp.src('./public/src/main.js')
        .pipe(browserify())
        .pipe(uglify())
        .pipe(gulp.dest('./public/build'))
 
});
