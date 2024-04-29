function renderPaymentOptions(req, res) {
  res.render('payment/options')
}

function handlePaymentOptions(req, res) {
  const paymentMethod = req.body['payment-method']
  const publicToken = res.locals.publicToken

  if (paymentMethod === 'card') {
    return res.redirect(`/${publicToken}/payment/card`)
  }

  if (paymentMethod === 'bank-transfer') {
    return res.redirect(`/${publicToken}/payment/bank-transfer`)
  }

  res.render('payment/options', {
    invalid: true,
  })
}

function renderBankTransferMethod(req, res) {
  res.render('payment/bank-transfer')
}

function renderCardMethod(req, res) {
  res.render('payment/card')
}

function renderCardFailure(req, res) {
  res.render('payment/failure')
}

function renderCardSuccess(req, res) {
  res.render('payment/success')
}

function redirectReturnUrl(req, res) {
  res.redirect(`/${res.locals.publicToken}/payment/card`)
}

module.exports = {
  renderPaymentOptions,
  handlePaymentOptions,
  renderBankTransferMethod,
  renderCardMethod,
  renderCardFailure,
  renderCardSuccess,
  redirectReturnUrl,
}
