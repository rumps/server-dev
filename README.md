# Rump Server Dev
[![NPM](http://img.shields.io/npm/v/rump-server-dev.svg?style=flat-square)](https://www.npmjs.org/package/rump-server-dev)
![License](http://img.shields.io/npm/l/rump-server-dev.svg?style=flat-square)
[![Dependencies](http://img.shields.io/david/rumps/rump-server-dev.svg?style=flat-square)](https://david-dm.org/rumps/rump-server-dev)


## About
Rump Server Dev is a Rump module that starts up a local development server that
serves built assets using [BrowserSync](http://www.browsersync.io/). For more
information, visit the [Rump repository](https://github.com/rumps/rump).


## API
The following is appended to the core Rump API:

### `rump.addGulpTasks(options)`
This module adds the following tasks:

- `server` will start up the `watch` task, then start up BrowserSync on the
destination path.
- `server:prod` is the same as `server` with `options.environment` set to
`'production'` for a production build.
- `info:server` will display information on what this specific module does,
specifically the port number the local server is started at. This task is also
added to the `info` task.

### `rump.configure(options)`
Redefine options for Rump and Rump modules to follow. In addition to what
options Rump and other Rump modules offer, the following options are
available alongside default values:

#### `options.globs.watch.server` (`'**/*'`)
This specifies which files to monitor for auto refresh by BrowserSync. By
default it monitors all built files, including those in subdirectories.

#### `options.server.port` (`process.env.PORT` or `3000`)
This specifies which port to run BrowserSync under.

#### `options.server.pushState` (`true`)
This specifies whether to support assistance with HTML5 history API by serving
`index.html` on requests that don't have a file location.

#### `options.server.watch` (`options.environment === 'development'`)
This specifies whether BrowserSync monitors files for file changes and inject
changes or perform full-page refreshes. (monitor if `true`) By default
monitoring is set up if the environment is set to development. (visit the main
Rump repository for more information on environment)

#### `options.server.browserSync`
This specifies any options you want to override in BrowserSync. If the
environment is set to `development`, notifications and ghost mode is enabled.
If the environment is set to `production`, notifications and ghost mode is
disabled. Visit the [options page](http://www.browsersync.io/docs/options/) for
specific options available.

### `rump.configs.browserSync`
This contains the generated options that are passed to BrowserSync in the Gulp
task. This is a good way to see what options are generated based on defaults
and overrides.
