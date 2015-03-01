'use strict';

// Temporary fix until old LoDash is updated in some Gulp dependency
Object.getPrototypeOf.toString = function() {
  return 'function getPrototypeOf() { [native code] }';
};

require('rump-static');
var assert = require('assert');
var chalk = require('chalk');
var co = require('co');
var fetch = require('node-fetch');
var fs = require('mz/fs');
var gulp = require('gulp');
var sinon = require('sinon');
var sleep = require('timeout-then');
var rump = require('../lib');

describe('rump dev server tasks', function() {
  beforeEach(function() {
    rump.configure({
      paths: {
        source: {
          root: 'test/src',
          static: ''
        },
        destination: {
          root: 'tmp'
        }
      },
      server: {
        pushState: true
      }
    });
  });

  it('are added and defined', function() {
    this.timeout(4000);
    var callback = sinon.spy();
    rump.on('gulp:main', callback);
    rump.on('gulp:server', callback);
    rump.addGulpTasks({prefix: 'spec'});
    // TODO Remove no callback check on next major core update
    assert(!callback.called || callback.calledTwice);
    assert(gulp.tasks['spec:info:server']);
    assert(gulp.tasks['spec:server']);
    assert(gulp.tasks['spec:server:prod']);
  });

  it('display correct information in info task', function() {
    var oldLog = console.log;
    var logs = [];
    console.log = function() {
      logs.push(chalk.stripColor(Array.from(arguments).join(' ')));
    };
    gulp.start('spec:info');
    console.log = oldLog;
    assert(logs.some(hasPaths));
    assert(logs.some(hasPort));
  });

  describe('for serving', function() {
    var original;

    before(co.wrap(function*() {
      original = yield fs.readFile('test/src/index.html');
    }));

    before(function(done) {
      this.timeout(10000);
      gulp.task('postserve', ['spec:server'], function() {
        done();
      });
      gulp.start('postserve');
    });

    afterEach(co.wrap(function*() {
      yield sleep(800);
      yield fs.writeFile('test/src/index.html', original);
      yield sleep(800);
    }));

    it('serves content', co.wrap(function*() {
      var original1 = yield fs.readFile('test/src/extra.html');
      var contents = yield [
        fetch('http://localhost:3000'),
        fetch('http://localhost:3000/index.html'),
        fetch('http://localhost:3000/void'),
        fetch('http://localhost:3000/extra.html')
      ];
      contents = yield [
        contents[0].text(),
        contents[1].text(),
        contents[2].text(),
        contents[3].text()
      ];
      assert(contents[0] === original.toString());
      assert(contents[1] === original.toString());
      assert(contents[2] === original.toString());
      assert(contents[3] === original1.toString());
    }));

    it('handles updates', co.wrap(function*() {
      var content = '<h1>New World</h1>\n';
      yield fs.writeFile('test/src/index.html', content);
      yield sleep(800);
      var contents = yield [
        fetch('http://localhost:3000'),
        fetch('http://localhost:3000/index.html'),
        fetch('http://localhost:3000/void')
      ];
      contents = yield [
        contents[0].text(),
        contents[1].text(),
        contents[2].text()
      ];
      assert(contents[0] === content);
      assert(contents[1] === content);
      assert(contents[2] === content);
    }));
  });
});

function hasPaths(log) {
  return log.includes('tmp');
}


function hasPort(log) {
  return log.includes('3000');
}
