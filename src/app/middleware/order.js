const { assign, map } = require('lodash')

const { fetch } = require('../lib/api')

async function fetchOrderDetails (req, res, next, publicToken) {
  const authToken = req.session.token
  let order
  let quote
  let invoice

  try {
    order = await fetch(authToken, `/v3/omis/public/order/${publicToken}`)

    assign(order, {
      subtotal_cost: parseInt(order.subtotal_cost) / 100,
      vat_cost: parseInt(order.vat_cost) / 100,
      total_cost: parseInt(order.total_cost) / 100,
    })
  } catch (error) {
    return next(error)
  }

  try {
    quote = await fetch(authToken, `/v3/omis/public/order/${publicToken}/quote`)
    quote.expires_on = new Date(quote.expires_on + 'T23:59:59')
    quote.expired = quote.expires_on < new Date()

    invoice = await fetch(authToken, `/v3/omis/public/order/${publicToken}/invoice`)
    invoice.overdue = invoice.payment_due_date < new Date()
  } catch (error) {
    if (error.statusCode !== 404) {
      return next(error)
    }
  }

  res.locals = assign({}, res.locals, {
    order,
    quote,
    invoice,
    publicToken,
  })
  next()
}

async function setPayments (req, res, next) {
  try {
    const paymentsResponse = await fetch(req.session.token, `/v3/omis/public/order/${res.locals.publicToken}/payment`)

    res.locals.payments = map(paymentsResponse, (payment) => {
      payment.amount = parseInt(payment.amount) / 100
      return payment
    })

    next()
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  fetchOrderDetails,
  setPayments,
}
