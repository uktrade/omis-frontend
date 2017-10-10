const { fetch } = require('../lib/api')

async function fetchOrderDetails (req, res, next, publicToken) {
  const authToken = req.session.token

  try {
    const order = await fetch(authToken, `/v3/omis/public/order/${publicToken}`)
    const quote = await fetch(authToken, `/v3/omis/public/order/${publicToken}/quote`)

    quote.expired = new Date(quote.expires_on) < new Date()

    res.locals = Object.assign({}, res.locals, {
      order,
      quote,
      publicToken,
    })
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  fetchOrderDetails,
}
