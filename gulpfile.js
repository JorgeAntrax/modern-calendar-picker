const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const DIR_CSS = './build/';
const DIR_SCSS_WATCH = './src/*.scss';
const DIR_JS_WATCH = './src/*.js';
const DIR_JS_SRC = './build/';
const SASS_FILES = [
    './src/calendar.scss'
];

/**Default task (runs when executing `gulp` comand in the console)*/

gulp.task('default', () => {
    gulp.watch(DIR_JS_WATCH, gulp.parallel('js'));
    gulp.watch(DIR_SCSS_WATCH, gulp.parallel('sass'));
});


// the task for sass compiler

gulp.task('sass', () => {
    return gulp.src(SASS_FILES)
        .pipe(sass({
            outputStyle: 'compressed',
            sourceComments: false
        }).on('error', sass.logError))
        .pipe(gulp.dest(DIR_CSS));
});


// the task compile sequence to typescript

gulp.task('js', () => {
    return gulp.src(DIR_JS_WATCH)
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest(DIR_JS_SRC));
});