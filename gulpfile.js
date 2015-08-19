require('./lib')
require('rump').autoload().addGulpTasks().configure({
  paths: {
    source: {root: 'test/fixtures', static: ''},
    destination: {root: 'tmp'},
  },
  server: {pushState: true},
})
