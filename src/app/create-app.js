const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const csrf = require('csurf')
const morganLogger = require('morgan')
const compression = require('compression')
const favicon = require('serve-favicon')
const session = require('express-session')
const MemoryStore = require('memorystore')(session)
const enforce = require('express-sslify')

const config = require('../../config')
const nunjucks = require('../../config/nunjucks')
const router = require('./routers')
const reporter = require('./lib/reporter')

const headers = require('./middleware/headers')
const errors = require('./middleware/errors')
const setCSRFToken = require('./middleware/set-csrf-token')
const setLocals = require('./middleware/set-locals')

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
  app.use(favicon(path.join(config.root, 'public/images', 'favicon.ico')))
  app.use(express.static(path.join(config.root, 'public'), { maxAge: staticMaxAge }))
  app.use('/js', express.static(path.join(config.buildDir, 'js'), { maxAge: staticMaxAge }))
  app.use('/css', express.static(path.join(config.buildDir, 'css'), { maxAge: staticMaxAge }))
  app.use('/images', express.static(path.join(config.buildDir, 'images'), { maxAge: staticMaxAge }))
  app.use('/fonts', express.static(path.join(config.buildDir, 'fonts'), { maxAge: staticMaxAge }))

  reporter.setup(app)

  if (!isDev) {
    app.use(compression())
    app.enable('trust proxy')
    app.use(enforce.HTTPS({
      trustProtoHeader: true,
    }))
  }

  app.use(cookieParser())
  app.use(session({
    store: new MemoryStore({
      checkPeriod: 86400000,
      ttl: config.session.ttl,
    }),
    cookie: {
      secure: !config.isDev,
      maxAge: config.session.ttl,
    },
    secret: config.session.secret,
    key: 'datahub_omis.sid',
    rolling: false,
    resave: false,
    saveUninitialized: true,
  }))
  app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }))

  app.use(setLocals)
  app.use(morganLogger((isDev ? 'dev' : 'combined')))
  app.use(headers(isDev))
  app.use(csrf({ cookie: true }))
  app.use(setCSRFToken())

  app.use(router)

  app.use(errors.handle404)

  reporter.handleErrors(app)

  app.use(errors.catchAll)

  return app
}
