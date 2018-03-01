function renderPaymentOptions (req, res) {
  res.render('payment/options')
}

function handlePaymentOptions (req, res) {
  const paymentMethod = req.body['payment-method']

  if (paymentMethod === 'card') {
    return res.redirect('payment/card')
  }

  if (paymentMethod === 'bank-transfer') {
    return res.redirect('payment/bank-transfer')
  }

  res.render('payment/options', {
    invalid: true,
  })
}

function renderBankTransferMethod (req, res) {
  res.render('payment/bank-transfer')
}

function renderCardMethod (req, res) {
  res.render('payment/card')
}

module.exports = {
  renderPaymentOptions,
  handlePaymentOptions,
  renderBankTransferMethod,
  renderCardMethod,
}
