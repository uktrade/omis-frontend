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
  if (get(req, 'paymentGatewaySession.id')) {
    return next()
  }

  try {
    const publicToken = res.locals.publicToken
    const authToken = req.session.token

    const paymentGatewaySession = await fetch(authToken, {
      method: 'post',
      url: `/v3/omis/public/order/${publicToken}/payment-gateway-session`,
    })

    req.paymentGatewaySession.id = paymentGatewaySession.id
    next()
  } catch (error) {
    next(error)
  }
}

async function setPaymentGatewaySession (req, res, next) {
  const sessionId = get(req, 'paymentGatewaySession.id')

  if (!sessionId) {
    return next()
  }

  try {
    const publicToken = res.locals.publicToken
    const authToken = req.session.token

    res.locals.paymentGatewaySession = await fetch(authToken, `/v3/omis/public/order/${publicToken}/payment-gateway-session/${sessionId}`)

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  checkOrderStatus,
  checkPaidStatus,
  createPaymentGatewaySession,
  setPaymentGatewaySession,
}
