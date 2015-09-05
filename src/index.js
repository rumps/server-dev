import rump from 'rump'
import {rebuild} from './configs'

rump.on('update:main', () => {
  rebuild()
  rump.emit('update:server:dev')
})

rump.on('gulp:main', (...args) => {
  require('./gulp')
  rump.emit('gulp:server:dev', ...args)
})

Reflect.defineProperty(rump.configs, 'browserSync', {
  get: () => rump.configs.main.server.browserSync,
})
