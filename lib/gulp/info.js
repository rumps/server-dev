'use strict';

var chalk = require('chalk');
var gulp = require('gulp');
var rump = require('rump');
var pkg = require('../../package');

gulp.task(rump.taskName('info:server'), function() {
  var destination = rump.configs.main.paths.destination.root;

  console.log();
  console.log(chalk.magenta('--- Server', 'v' + pkg.version));
  console.log('Static files from', chalk.green(destination), 'are served',
              'on port', chalk.yellow(rump.configs.browserSync.port));
  console.log();
});

gulp.tasks[rump.taskName('info')].dep.push(rump.taskName('info:server'));
