// @ts-nocheck
const { task, src, dest, series, parallel, watch  } = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const injectHTML = require('gulp-inject-in-html');

const html = () => src('./src/pages/*.html').pipe(dest('./dist/'));
const images = () => src('./src/images/*.*').pipe(dest('./dist/images'));

const styles = () => {
  task(
    src('src/scss/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(dest('dist/css'))
  )
}

const replaceStyles = () => {
  task(
    src('dist/*.html')
      .pipe(injectHTML())
      .pipe(dest('./dist/build/'))
  )
}

const server = () => task(browserSync.init({ server: { baseDir: './dist/build' } }))

const watcher = () => {
  watch(['src/pages/*.html']).on('all', series(parallel(html)));
  watch(['src/scss/**/*.scss', 'src/scss/*.scss']).on('all', series(parallel(styles, html)));
  watch(['src/images/*.*']).on('all', series(parallel(images, styles, html, browserSync.reload)));
  watch(['dist/*.html']).on('all', series(parallel(replaceStyles, browserSync.reload)));
}

task('default',
  series(
    parallel(
        images,
        styles,
        html,
        replaceStyles,
        server,
        watcher
      )
    )
);

