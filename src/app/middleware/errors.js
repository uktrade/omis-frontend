const config = require('../../../config')
const logger = require('../lib/logger')

module.exports = {
  handle404: function (req, res) {
    res.status(404)
    res.render('errors/404')
  },

  catchAll: function (err, req, res, next) {
    let statusMessage = 'Something has gone wrong'

    if (res.headersSent) {
      return next(err)
    }

    if (err.code === 'EBADCSRFTOKEN') {
      statusMessage = 'This form has been tampered with'
    }

    logger.error(err)

    res.status(500)
    res.render('errors/default', {
      statusMessage,
      error: err,
      showErrors: config.showErrors,
    })
  },
}
