const { get } = require('lodash')

const { fetch } = require('../lib/api')

function checkOrderStatus (req, res, next) {
  const orderStatus = get(res.locals, 'order.status')

  if (!['quote_accepted', 'paid', 'complete'].includes(orderStatus)) {
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
  const publicToken = res.locals.publicToken

  if (get(req, `paymentGatewaySession.${publicToken}`)) {
    return next()
  }

  try {
    const paymentGatewaySession = await fetch(req.session.token, {
      method: 'post',
      url: `/v3/omis/public/order/${publicToken}/payment-gateway-session`,
    })

    req.paymentGatewaySession[publicToken] = paymentGatewaySession.id
    next()
  } catch (error) {
    if (error.statusCode === 409) {
      return res.redirect(`/${publicToken}/payment`)
    }

    next(error)
  }
}

async function setPaymentGatewaySession (req, res, next) {
  const publicToken = res.locals.publicToken
  const sessionId = req.params.paymentSessionId || get(req, `paymentGatewaySession.${publicToken}`)

  if (!sessionId) {
    return next()
  }

  try {
    res.locals.paymentGatewaySession = await fetch(req.session.token, `/v3/omis/public/order/${publicToken}/payment-gateway-session/${sessionId}`)

    next()
  } catch (error) {
    next(error)
  }
}

function checkPaymentGatewaySessionStatus (skipFailure = false) {
  return function (req, res, next) {
    const publicToken = res.locals.publicToken
    const status = get(res.locals, 'paymentGatewaySession.status')

    if (status === 'success') {
      return res.redirect(`/${publicToken}/payment/card/success`)
    }

    if (['failed', 'cancelled', 'error'].includes(status)) {
      req.paymentGatewaySession = {}

      if (skipFailure) {
        return res.redirect(`/${publicToken}/payment/card`)
      }

      return res.redirect(`/${publicToken}/payment/card/failure`)
    }

    next()
  }
}

function validatePaymentGatewaySession (req, res, next) {
  const publicToken = res.locals.publicToken
  const requestSessionId = req.params.paymentSessionId
  const sessionCookieId = get(req, `paymentGatewaySession.${publicToken}`)

  if (sessionCookieId !== requestSessionId) {
    req.paymentGatewaySession = {}
    return res.redirect(`/${publicToken}/payment/card/failure`)
  }

  next()
}

module.exports = {
  checkOrderStatus,
  checkPaidStatus,
  createPaymentGatewaySession,
  setPaymentGatewaySession,
  checkPaymentGatewaySessionStatus,
  validatePaymentGatewaySession,
}
