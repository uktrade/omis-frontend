const { assign } = require('lodash')

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
    invoice = await fetch(authToken, `/v3/omis/public/order/${publicToken}/invoice`)

    quote.expired = new Date(quote.expires_on) < new Date()
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

module.exports = {
  fetchOrderDetails,
}
