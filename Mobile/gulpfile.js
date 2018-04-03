// Load plugins
const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const cssmin = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const newer = require('gulp-newer');
const babel = require('gulp-babel');
const base64 = require('gulp-base64');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const cache = require('gulp-cached');
const changed = require('gulp-changed');
const del = require('del');

gulp.task('serve', function () {
    browserSync({
        server: {
            baseDir: './'
        }
    });
    gulp.watch(['dist/*', 'dist/**/*', 'dist/**/**/*'], {cwd: './'}, reload);
});
gulp.task('watch', function () {
    gulp.watch(['dev/scss/*', 'dev/scss/**/*'], ['devStyles']);
    gulp.watch(['dev/js/*', 'dev/js/**/*'], ['devScripts']);
});


/*
* 开发环境 Start
* */
gulp.task('devStyles', function () {
    return gulp.src([
        'dev/scss/*.scss',
        'dev/scss/**/*.scss'
    ])
        .pipe(changed('dist/styles'))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write("maps"))
        .pipe(gulp.dest('dist/styles'))
});
gulp.task('devScripts', function () {
    gulp.src([
        'dev/js/*.js',
        'dev/js/**/*.js'
    ])
        .pipe(changed('dist/scripts'))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('dist/scripts'))
});
gulp.task('dev', function () {
    gulp.start('devStyles', 'devScripts', 'serve', 'watch');
});
/*
* 开发环境 End
* */


/*
* 生产环境 Start
* */
gulp.task('styles', function () {
    return gulp.src([
        'dev/scss/*.scss',
        'dev/scss/**/*.scss'
    ])
        .pipe(changed('dist/styles'))
        .pipe(base64({
            baseDir: 'dist/images',
            extensions: ['svg', 'png', /\.jpg#datauri$/i],
            exclude: [/\.server\.(com|net)\/dynamic\//, '--live.jpg'],
            maxImageSize: 10 * 1024,
            debug: true
        }))
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(cssmin({
            keepSpecialComments: '*'
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/styles'))
});
gulp.task('scripts', function () {
    gulp.src([
        'dev/js/*.js',
        'dev/js/**/*.js'
    ])
        .pipe(changed('dist/scripts'))
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts'))
});

// 清理开发环境文件
gulp.task('clean', function () {
    return del([
        'dist/scripts',
        'dist/styles'
    ]);
});
// 生成生产环境文件
gulp.task('build', function () {
    gulp.start('styles', 'scripts');
});
/*
* 生产环境 End
* */