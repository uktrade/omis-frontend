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
  const publicToken = res.locals.publicToken
  const authToken = req.session.token

  try {
    const gatewaySession = await fetch(authToken, {
      method: 'post',
      url: `/v3/omis/public/order/${publicToken}/payment-gateway-session`,
    })

    res.locals.paymentUrl = gatewaySession.payment_url

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  checkOrderStatus,
  checkPaidStatus,
  createPaymentGatewaySession,
}
