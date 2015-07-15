"use strict";

var path    = require('path');
var mkdirp    = require('mkdirp');
var del     = require('del');
var source    = require('vinyl-source-stream');
var buffer    = require('vinyl-buffer');
var browserSync = require('browser-sync');
var browserify  = require('browserify');
var gulp    = require('gulp');
var changed   = require('gulp-changed');
var debug   = require('gulp-debug');
var concat    = require('gulp-concat');
var jshint    = require('gulp-jshint');
var uglify    = require('gulp-uglify');
var react     = require('gulp-react');
var minifyCss   = require('gulp-minify-css');

var reload = browserSync.reload;

var targets = {
  scripts:  './source/scripts',
  _scripts:   './public/js',
  styles:   './source/styles',
  _styles:  './public/css',
  views:    './source/views',
  _views:   './public'
}

gulp.task('clean', function(done) {
  del.sync('./public');
  [
    targets._scripts,
    targets._styles,
  ].forEach(function(key) {
    mkdirp.sync(key);
  });

  done();
});

// Lint js files
//
gulp.task('lint-js', function() {
  return gulp.src(path.join(targets.scripts, '**/*.js'))
      //.pipe(changed(targets.scripts))
    .pipe(debug({
      title: 'linting js:'
    }))
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Move js files
// Note: every .js file *except* app.js
//
gulp.task('js', ['lint-js'], function() {
    return gulp.src(path.join(targets.scripts, '**/!(app).js'))
      //.pipe(changed(targets.scripts))
    .pipe(debug({
      title: 'uglifying+moving js files:'
    }))
    .pipe(uglify())
      .pipe(gulp.dest(targets._scripts))
    .pipe(reload({
      stream: true
    }));
});

// Concatenate .css files into app.css bundle, and move.
//
gulp.task('concat-css', function() {
    return gulp.src(path.join(targets.styles, '**/*.css'))
      //.pipe(changed(targets.styles))
    .pipe(debug({
      title: 'css bundling:'
    }))
        .pipe(concat('app.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest(targets._styles))
    .pipe(reload({
      stream: true
    }));
});

// All .html files in source folder
//
gulp.task('views', function() {
  return gulp.src(path.join(targets.views, '**/*.html'))
    //.pipe(changed(targets._views))
    .pipe(debug({
      title: 'building views:'
    }))
    .pipe(gulp.dest(targets._views))
    .pipe(reload({
      stream: true
    }));
});

// Compile JSX
//
gulp.task('react', function(done) {
    done();
});

// Fetch our main app code and browserify it
// This bundle will be loaded by views, such as index.html
//
gulp.task('browserify', ['js', 'react'], function() {
  return browserify('./' + targets.scripts + '/app.js')
    .bundle()
    // Converts browserify out to streaming vinyl file object
    //
    .pipe(source('app.js'))
    // uglify needs conversion from streaming to buffered vinyl file object
    //
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(targets._scripts))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('browsersync', function(done) {

  // We don't expose the live server in production.
  // This is intended to run on local dev boxes.
  //
  if(process.env.PRODUCTION) {
    return done();
  }

  browserSync({
    notify: false,
    injectChanges: false,
    ghostMode: {
      clicks: true,
      forms: true,
      scroll: true
    },
    browser: "google chrome",
    scrollThrottle: 100,
    proxy: '127.0.0.1:8080'
  });

  gulp.watch(path.join(targets.scripts, '**/*.js'), ['js']);
  gulp.watch(path.join(targets.views, '**/*.html'), ['views']);
  gulp.watch(path.join(targets.styles, '**/*.css'), ['concat-css']);
  gulp.watch(path.join(targets.scripts, 'app.js'), ['browserify']);

  done();
});

// This is what runs when you execute generic `gulp`
//
gulp.task('default', [
  'clean',
  'lint-js',
  'js',
  'concat-css',
  'views',
  'browserify',
  'react'
], function(done) {
  done();
});