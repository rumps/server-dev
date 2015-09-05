import gulp, {tasks} from 'gulp'
import rump from 'rump'
import {green, magenta, yellow} from 'chalk'
import {version} from '../../package'

const name = ::rump.taskName
const task = ::gulp.task
const {configs} = rump

task(name('info:server:dev'), () => {
  const {root} = configs.main.paths.destination
  const {port} = configs.browserSync
  let action = 'served'
  if(configs.main.server.pushState) {
    action = `served ${yellow('with pushState')}`
  }
  console.log()
  console.log(magenta(`--- Server Dev v${version}`))
  console.log(`Static files from ${green(root)} are ${action}`,
              `on port ${yellow(port)}`)
  console.log()
})

tasks[name('info')].dep.push(name('info:server:dev'))
