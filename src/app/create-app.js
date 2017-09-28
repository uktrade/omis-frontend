const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const csrf = require('csurf')
const morganLogger = require('morgan')
const compression = require('compression')
const session = require('express-session')
const MemoryStore = require('memorystore')(session)

const config = require('../../config')
const nunjucks = require('../../config/nunjucks')
const router = require('./router')
const reporter = require('./lib/reporter')

const ping = require('./middleware/ping')
const forceHttps = require('./middleware/force-https')
const headers = require('./middleware/headers')
const errors = require('./middleware/errors')
const setCSRFToken = require('./middleware/set-csrf-token')

module.exports = function () {
  const app = express()
  const env = app.get('env')
  const isDev = (env === 'development')

  let staticMaxAge = isDev ? 0 : '2y'

  app.disable('x-powered-by')

  app.set('view engine', 'njk')
  app.set('view cache', config.views.cache)
  nunjucks(app, config)

  // Static files
  app.use(express.static(path.join(config.root, 'public'), { maxAge: staticMaxAge }))
  app.use('/js', express.static(path.join(config.buildDir, 'js'), { maxAge: staticMaxAge }))
  app.use('/css', express.static(path.join(config.buildDir, 'css'), { maxAge: staticMaxAge }))
  app.use('/images', express.static(path.join(config.buildDir, 'images'), { maxAge: staticMaxAge }))
  app.use('/fonts', express.static(path.join(config.buildDir, 'fonts'), { maxAge: staticMaxAge }))

  reporter.setup(app)

  if (!isDev) {
    app.use(compression())
  }

  app.use(session({
    store: new MemoryStore({
      checkPeriod: 86400000,
    }),
    secret: 'keyboard cat',
  }))

  app.use(cookieParser())
  app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }))
  app.use(forceHttps(isDev))
  app.use(morganLogger((isDev ? 'dev' : 'combined')))
  app.use(headers(isDev))
  app.use(csrf())
  app.use(setCSRFToken())
  app.use(ping)

  app.use(router)

  app.use(errors.handle404)

  reporter.handleErrors(app)

  app.use(errors.catchAll)

  return app
}
