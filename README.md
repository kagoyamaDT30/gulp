# gulp4対応フォーマット

## やること
gulpfileの編集
→proxy欄を編集

ターミナル
```
yarn install

gulp
```
- `gulp`
ブラウザシンク&watchで起動させる

- `gulp prod`
`dist`を生成する（圧縮形式のソース）

## プラグイン
nodeはv16.13.0

- browser-sync:ファイル変更時にブラウザを自動リロード
- gulp-autoprefixer:prefixを自動で入れる
- gulp-clean-css:css圧縮
- gulp-notify:gulpエラー通知
- gulp-plumber:watch時のエラーによる強制終了を防ぐ
- gulp-rename:ファイル名を変更する(.min用)
- gulp-sass:sassコンパイル用
- gulp-sass-glob:sassワイルドカード使用
- gulp-uglify:js圧縮
- imagemin-mozjpeg:jpeg圧縮
- imagemin-pngquant:pngの圧縮率をあげる
