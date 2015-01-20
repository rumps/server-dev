'use strict';

var browserSync = require('browser-sync');
var gulp = require('gulp');
var rump = require('rump');

gulp.task(rump.taskName('server'),
          [rump.taskName('watch')],
          function(callback) {
  browserSync(rump.configs.browserSync, callback);
});

gulp.task(rump.taskName('server:prod'), [
  rump.taskName('prod:setup'),
  rump.taskName('server')
]);
