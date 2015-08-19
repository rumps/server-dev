import browserSync from 'browser-sync'
import gulp from 'gulp'
import rump from 'rump'

const name = ::rump.taskName,
      task = ::gulp.task,
      {configs} = rump

task(name('server:dev'), [name('watch')], done => {
  browserSync(configs.browserSync, done)
})
task(name('server:dev:prod'), [name('prod:setup'), name('server:dev')])
