var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var autoprefixer = require('gulp-autoprefixer');
var browserify = require('gulp-browserify');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var merge = require('merge-stream');

var SOURCEPATH = {

  sassSource : 'src/scss/*.scss',
  htmlSource: 'src/*.html',
  jsSource: 'src/js/**'
}
var APPPATH = {
  root: 'app/',
  css : 'app/css',
  js: 'app/js',
  fonts: 'app/fonts'
}

gulp.task('clean-html', function(){
  return gulp.src(APPPATH.root + '/*.html', {read: false, force: true})
  .pipe(clean());
});

gulp.task('clean-js', function(){
  return gulp.src(APPPATH.js + '/*.js', {read: false, force: true})
  .pipe(clean());
});


gulp.task('sass', function(){
  var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
  var sassFiles;

sassFiles = gulp.src(SOURCEPATH.sassSource)
  .pipe(autoprefixer())
  .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))

  return merge(bootstrapCSS, sassFiles)
  .pipe(concat('app.css'))
  .pipe(gulp.dest(APPPATH.css));
});

gulp.task('moveFonts', function(){
  gulp.src('./node_modules/bootstrap/dist/fonts/*.{eot,svg,ttf,woff, woff2}')
  .pipe(gulp.dest(APPPATH.fonts));
});

gulp.task('scripts',['clean-js'], function(){
  gulp.src(SOURCEPATH.jsSource)
  .pipe(concat('main.js'))
  .pipe(browserify())
  .pipe(gulp.dest(APPPATH.js));
});

gulp.task('copy', ['clean-html'], function(){
  gulp.src(SOURCEPATH.htmlSource)
  .pipe(gulp.dest(APPPATH.root))
});

gulp.task('serve', ['sass'], function(){
  browserSync.init([APPPATH.css + '/*.css', APPPATH.root + '/*.html', APPPATH.js + '/*.js'], {
    server: {
      baseDir: APPPATH.root
    }
  })

});

gulp.task('watch', ['serve', 'sass', 'copy', 'clean-html',  'scripts', 'clean-js', 'moveFonts'] , function(){
  gulp.watch([SOURCEPATH.sassSource], ['sass']);
  gulp.watch([SOURCEPATH.htmlSource], ['copy']);
gulp.watch([SOURCEPATH.jsSource], ['scripts']);
});

gulp.task('default', ['watch'] );
