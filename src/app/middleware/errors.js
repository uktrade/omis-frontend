const config = require('../../../config')
const logger = require('../lib/logger')

module.exports = {
  handle404: function (req, res, next) {
    const error = new Error('Not Found')
    error.statusCode = 404
    next(error)
  },

  catchAll: function (error, req, res, next) {
    const statusCode = error.statusCode = (error.statusCode || 500)
    let statusMessage = statusCode === 404
      ? 'We couldn\'t find that page'
      : 'Something has gone wrong'

    if (res.headersSent) {
      return next(error)
    }

    if (error.code === 'EBADCSRFTOKEN') {
      statusMessage = 'This form has been tampered with'
    }

    if (statusCode !== 404) {
      logger.error(error)
    }

    res.status(statusCode)
    res.render('errors', {
      error,
      statusCode,
      statusMessage,
      showErrors: config.showErrors,
    })
  },
}
