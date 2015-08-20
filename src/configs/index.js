import historyApiFallback from 'connect-history-api-fallback'
import extend from 'extend'
import rump from 'rump'
import {join} from 'path'

const {configs} = rump,
      history = historyApiFallback()

rebuild()

export function rebuild() {
  const development = configs.main.environment === 'development',
        {PORT} = process.env
  let defaults
  configs.main.globs = extend(true, {
    watch: {server: '**/*'},
  }, configs.main.globs)
  configs.main.server = extend(true, {
    port: parseInt(PORT, 10) || 3000,
    watch: development,
  }, rump.configs.main.server)
  defaults = {
    ghostMode: development,
    notify: development,
    online: false,
    port: configs.main.server.port,
    server: {
      baseDir: configs.main.paths.destination.root,
      middleware: [],
    },
  }
  if(configs.main.server.watch) {
    defaults.files = join(configs.main.paths.destination.root,
                          configs.main.globs.watch.server)
  }
  if(configs.main.server.pushState) {
    defaults.server.middleware.push(history)
  }
  configs.main.server.browserSync = extend(true, defaults, configs.main.server.browserSync)
}
