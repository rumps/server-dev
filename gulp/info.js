'use strict';

var chalk = require('chalk');
var gulp = require('gulp');
var path = require('path');
var rump = require('rump');
var pkg = require('../package');

gulp.task(rump.taskName('info:server'), function() {
  var destination = path.join(rump.configs.main.paths.destination.root,
                              rump.configs.main.paths.destination.static);

  console.log();
  console.log(chalk.magenta('--- Server', 'v' + pkg.version));
  console.log('Static files from', chalk.green(destination), 'are served',
              'on port', chalk.yellow(rump.configs.browserSync.port));
  console.log();
});

gulp.tasks[rump.taskName('info')].dep.push(rump.taskName('info:server'));
