const { get } = require('lodash')

const { fetch } = require('../lib/api')
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

async function createPaymentGatewaySession (req, res, next) {
  if (get(req, 'paymentGatewaySession.payment_url')) {
    return next()
  }

  try {
    const publicToken = res.locals.publicToken
    const authToken = req.session.token

    req.paymentGatewaySession = await fetch(authToken, {
      method: 'post',
      url: `/v3/omis/public/order/${publicToken}/payment-gateway-session`,
    })

    next()
  } catch (error) {
    next(error)
  }
}

function setPaymentGatewayUrl (req, res, next) {
  res.locals.paymentGatewayUrl = get(req, 'paymentGatewaySession.payment_url')
  next()
}

module.exports = {
  checkOrderStatus,
  checkPaidStatus,
  createPaymentGatewaySession,
  setPaymentGatewayUrl,
}
