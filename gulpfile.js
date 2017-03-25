const gulp = require('gulp')
const $ = require('gulp-load-plugins')()

// image lossy compression plugins
const compressJpg = require('imagemin-jpeg-recompress')
const pngquant = require('imagemin-pngquant-gfw')

const src = 'images/'
const dst = 'public/images/'

function buildOutputs (sizes, resolutions) {
  var outputs = []
  for (let i = 0; i < sizes.length; i += 1) {
    let size = sizes[i]
    for (let j = 0; j < resolutions.length; j += 1) {
      let res = resolutions[j]
      let resext = '-' + res + 'x'
      if (res === 1) { resext = '' }
      let output = {
        width: size * res,
        rename: {
          suffix: '-' + size + 'px' + resext
        }
      }
      outputs.push(output)
      output = {
        width: size * res,
        rename: {
          suffix: '-' + size + 'px' + resext,
          extname: '.webp'
        }
      }
      outputs.push(output)
    }
  }
  outputs.push({
    progressive: true,
    compressionLevel: 6,
    withMetadata: false
  })
  outputs.push({
    rename: {
      extname: '.webp'
    }
  })
  return outputs
}

gulp.task('background', function () {
  return gulp.src(src + '/*_background.jpg')
    .pipe($.changed(dst))
    .pipe($.responsive({
      '*': buildOutputs([360, 720, 1280, 1920], [1, 2, 3])
    }, {
      progressive: true,
      compressionLevel: 6,
      withMetadata: false,
      withoutenlargement: true,
      skipOnEnlargement: false,
      errorOnEnlargement: false,
      errorOnUnusedConfig: false
    }))
    .pipe($.imagemin([
      $.imagemin.gifsicle(),
      compressJpg({
        loops: 4,
        min: 50,
        max: 95,
        quality: 'high'
      }),
      $.imagemin.optipng(),
      $.imagemin.svgo()
    ]))
  .pipe(gulp.dest(dst))
})
gulp.task('profile', function () {
  return gulp.src(src + '/*_profile.jpg')
    .pipe($.changed(dst))
    .pipe($.imagemin([
      $.imagemin.gifsicle(),
      compressJpg({
        loops: 4,
        min: 50,
        max: 95,
        quality: 'high'
      }),
      $.imagemin.optipng(),
      $.imagemin.svgo()
    ]))
    .pipe(gulp.dest(dst))
})
gulp.task('png', function () {
  return gulp.src(src + '/*.png')
    .pipe($.changed(dst))
    .pipe($.imagemin([
      $.imagemin.gifsicle(),
      compressJpg({
        loops: 4,
        min: 50,
        max: 95,
        quality: 'high'
      }),
      $.imagemin.optipng(),
      $.imagemin.svgo()
    ]))
    .pipe(pngquant({ quality: '65-80', speed: 4 })())
    .pipe(gulp.dest(dst))
})
gulp.task('png-root', function () {
  return gulp.src('*.png')
    .pipe($.changed(dst))
    .pipe($.imagemin([
      $.imagemin.gifsicle(),
      compressJpg({
        loops: 4,
        min: 50,
        max: 95,
        quality: 'high'
      }),
      $.imagemin.optipng(),
      $.imagemin.svgo()
    ]))
    .pipe(pngquant({ quality: '65-80', speed: 4 })())
    .pipe(gulp.dest('public/'))
})
gulp.task('root', function () {
  return gulp.src(['*.ico', '*.xml'])
    .pipe(gulp.dest('public/'))
})
gulp.task('images', ['png', 'background', 'profile', 'png-root', 'root'])
gulp.task('images:clean', function () {
  return gulp.src('public/', {read: false})
    .pipe($.clean())
})
