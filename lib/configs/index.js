'use strict';

var historyApiFallback = require('connect-history-api-fallback');
var extend = require('extend');
var path = require('path');
var rump = require('rump');

exports.rebuild = function() {
  var development = rump.configs.main.environment === 'development';

  rump.configs.main.globs = extend(true, {
    watch: {
      server: '**/*'
    }
  }, rump.configs.main.globs);

  rump.configs.main.server = extend(true, {
    port: parseInt(process.env.PORT, 10) || 3000,
    watch: development
  }, rump.configs.main.server);

  var bsDefaults = {
    ghostMode: development,
    notify: development,
    online: false,
    port: rump.configs.main.server.port,
    server: {
      baseDir: rump.configs.main.paths.destination.root,
      middleware: []
    }
  };

  if(rump.configs.main.server.watch) {
    bsDefaults.files = path.join(rump.configs.main.paths.destination.root,
                                 rump.configs.main.globs.watch.server);
  }
  if(rump.configs.main.server.pushState) {
    bsDefaults.server.middleware.push(historyApiFallback);
  }

  exports.browserSync = extend(true, bsDefaults,
                               rump.configs.main.server.browserSync);
};

exports.rebuild();
