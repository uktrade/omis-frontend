const { fetch } = require('../lib/api')

async function renderReceipt (req, res, next) {
  const { publicToken } = res.locals
  const { token } = req.session
  let payments

  try {
    payments = await fetch(token, `/v3/omis/public/order/${publicToken}/payment`)
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
