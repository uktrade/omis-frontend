const { get } = require('lodash')

const { isProd, showPaymentJourney } = require('../../../config')

function checkOrderStatus (req, res, next) {
  const orderStatus = get(res.locals, 'order.status')

  if (
    (isProd && !showPaymentJourney) ||
    !['quote_accepted', 'paid', 'complete'].includes(orderStatus)
  ) {
    return res.redirect(`/${res.locals.publicToken}`)
  }

  next()
}

function checkPaidStatus (req, res, next) {
  const orderStatus = get(res.locals, 'order.status')

  if (['paid', 'complete'].includes(orderStatus)) {
    return res.render('payment/paid')
  }

  next()
}

module.exports = {
  checkOrderStatus,
  checkPaidStatus,
}
