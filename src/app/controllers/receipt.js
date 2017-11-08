const { map } = require('lodash')

const { fetch } = require('../lib/api')

async function renderReceipt (req, res, next) {
  const { publicToken } = res.locals
  const { token } = req.session
  let payments

  try {
    const paymentsResponse = await fetch(token, `/v3/omis/public/order/${publicToken}/payment`)

    payments = map(paymentsResponse, (payment) => {
      payment.amount = parseInt(payment.amount) / 100
      return payment
    })
  } catch (error) {
    return next(error)
  }

  res.render('receipt', {
    payments,
  })
}

module.exports = {
  renderReceipt,
}
