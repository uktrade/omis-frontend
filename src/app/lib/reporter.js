const Sentry = require('@sentry/node')
const { nodeProfilingIntegration } = require('@sentry/profiling-node')
const config = require('../../../config')
const logger = require('./logger')

const useSentry = !!config.sentryDsn

if (useSentry) {
  Sentry.init({
    dsn: config.sentryDsn,
    integrations: [nodeProfilingIntegration()],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
  })
}

module.exports = {
  handleErrors: function (app) {
    if (useSentry) {
      Sentry.setupExpressErrorHandler(app)
    }
  },

  message: function (level, msg, extra) {
    if (useSentry) {
      Sentry.captureMessage(msg, {
        level,
        extra,
      })
    } else {
      logger.warn(msg, JSON.stringify(extra))
    }
  },

  captureException: function (err) {
    if (useSentry) {
      Sentry.captureException(err)
    } else {
      logger.error(err)
    }
  },
}
