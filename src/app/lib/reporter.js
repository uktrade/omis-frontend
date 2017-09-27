const raven = require('raven')
const config = require('../config')
const logger = require('./logger')

const useSentry = !!config.sentryDsn

if (useSentry) {
  raven.config(config.sentryDsn, { release: config.version }).install()
}

module.exports = {
  setup: function (app) {
    if (useSentry) {
      app.use(raven.requestHandler())
    }
  },

  handleErrors: function (app) {
    if (useSentry) {
      app.use(raven.errorHandler())
    }
  },

  message: function (level, msg, extra) {
    if (useSentry) {
      raven.captureMessage(msg, {
        level,
        extra,
      })
    } else {
      logger.warn(msg, JSON.stringify(extra))
    }
  },

  captureException: function (err) {
    if (useSentry) {
      raven.captureException(err)
    } else {
      logger.error(err)
    }
  },
}
