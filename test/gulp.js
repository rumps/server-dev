import 'rump-static'
import '../src'
import fetch from 'node-fetch'
import gulp from 'gulp'
import rump from 'rump'
import timeout from 'timeout-then'
import {stripColor} from 'chalk'
import {readFile, writeFile} from 'mz/fs'
import {spy} from 'sinon'

describe('tasks', function() {
  this.timeout(0)

  afterEach(() => {
    rump.configure({
      paths: {
        source: {root: 'test/fixtures', static: ''},
        destination: {root: 'tmp'},
      },
      server: {pushState: true},
    })
  })

  it('are added and defined', () => {
    const callback = spy()
    rump.on('gulp:main', callback)
    rump.on('gulp:server:dev', callback)
    rump.addGulpTasks({prefix: 'spec'})
    callback.should.be.calledTwice()
    gulp.tasks['spec:info:server:dev'].should.be.ok()
    gulp.tasks['spec:server:dev'].should.be.ok()
    gulp.tasks['spec:server:dev:prod'].should.be.ok()
  })

  it('display correct information in info task', () => {
    const logs = [],
          {log} = console
    console.log = newLog
    gulp.start('spec:info')
    console.log = log
    logs.slice(-4).should.eql([
      '',
      '--- Server Dev v0.8.0',
      'Static files from tmp are served on port 3000',
      '',
    ])

    function newLog(...args) {
      logs.push(stripColor(args.join(' ')))
    }
  })

  describe('for serving', () => {
    let original

    before(async() => {
      original = await readFile('test/fixtures/index.html')
      await new Promise(resolve => {
        gulp.task('postserve', ['spec:server:dev'], resolve)
        gulp.start('postserve')
      })
    })

    beforeEach(() => timeout(1000))

    afterEach(() => writeFile('test/fixtures/index.html', original))

    it('serves content', async() => {
      const original1 = await readFile('test/fixtures/extra.html'),
            response = await Promise.all([
              fetch('http://localhost:3000/'),
              fetch('http://localhost:3000/index.html'),
              fetch('http://localhost:3000/void'),
              fetch('http://localhost:3000/extra.html'),
            ]),
            contents = await Promise.all(response.map(x => x.text()))
      contents[0].should.equal(original.toString())
      contents[1].should.equal(original.toString())
      contents[2].should.equal(original.toString())
      contents[3].should.equal(original1.toString())
    })

    it('handles updates', async() => {
      const newContent = '<h1>New World</h1>\n'
      let response, contents
      await writeFile('test/fixtures/index.html', newContent)
      await timeout(1000)
      response = await Promise.all([
        fetch('http://localhost:3000/'),
        fetch('http://localhost:3000/index.html'),
        fetch('http://localhost:3000/void'),
      ])
      contents = await Promise.all(response.map(x => x.text()))
      contents.forEach(content => content.should.equal(newContent))
    })
  })
})
