'use strict';

var gulp    = require('gulp'),
    gSass    = require('gulp-sass')(require('sass')),
    glob    = require('gulp-sass-glob'), // sassのimportでワイルドカードを利用可能に
    prefix  = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber'), //エラー発生時の強制終了防止
    notify  = require('gulp-notify'),
    bs      = require('browser-sync').create();

// 画像圧縮 プラグイン
// imageminは7.1.0で固定。それ以降はES module記法になる
const imagemin = require('gulp-imagemin');

// 下記2プラグインのバージョンはひとまず固定。上げるとエラーが出る
const mozjpeg = require('imagemin-mozjpeg');
const pngquant = require('imagemin-pngquant');

// js圧縮 プラグイン
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const cleanCss = require('gulp-clean-css');

// gulp-sassの設定
const sass = (done) => {
    gulp.src('./assets/scss/*.scss', {
        sourcemaps: true, // sourcemapの書き出し設定。不要ならfalseにする
    })
    .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
    .pipe(glob({ignorePaths: ['*node_modules*']}))
    .pipe(gSass({outputStyle: 'expanded'}))
    // ベンダープレフィックス自動付加。package.jsonの方に記述に変更された
    .pipe(prefix({
        cascade: false
    }))
    .pipe(gulp.dest('./assets/css/',{
      sourcemaps: './', //sourcemapのdist箇所指定。同一箇所なら./
    }))
    .pipe(bs.stream());
    done();
};

// BrowserSyncの設定
// ブラウザ画面への通知を無効化
const sync = (done) => {
    bs.init({
        //MAMP用のproxy
        proxy: "localhost:8888/gulp",
        notify: false
    });
    done();
};

const reload = (done) =>  {
    bs.reload();
    done();
};

// 画像圧縮
const image = (done) => {
    gulp.src('./assets/images/**', {
        since: gulp.lastRun(image)
    })
    .pipe(imagemin(
        [
            pngquant({
                quality: [.7, .85],
                speed: 1,
            }),
            mozjpeg({ quality: 80 }),
        ]
    ))
    .pipe(gulp.dest('./dist/images'));
    done();
};

// js圧縮
const compressJs = (done) => {
    gulp.src('./assets/js/*.js')
    .pipe(uglify())
    .pipe(rename({
        extname: '.min.js'
    }))
    .pipe(gulp.dest('./dist/js'));
    done();
}

// css圧縮
const compressCss = (done) => {
    gulp.src('./assets/css/style.css')
    .pipe(cleanCss())
    .pipe(rename({
        extname: '.min.css'
    }))
    .pipe(gulp.dest('./dist/css'))
    .pipe(bs.stream());
    done();
}

// exportしないとgulp叩いてもnot definedになる
exports.sass = sass;
exports.sync = sync;
exports.reload = reload;
exports.image = image;
exports.compressJs = compressJs;
exports.compressCss = compressCss;

const watch = (done) =>  {
    gulp.watch('./assets/scss/**/*.scss', sass);
    gulp.watch(['./*.php', './components/**'], reload);
    gulp.watch('./assets/images/**', image);
    gulp.watch('./assets/css/style.css', compressCss);
    gulp.watch('./assets/js/**', compressJs);
    done();
};

exports.watch = watch;

exports.default = gulp.series(
    sync, watch
);

exports.prod = gulp.series(
    image, compressCss, compressJs
);
