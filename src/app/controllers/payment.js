function renderPaymentOptions (req, res) {
  res.render('payment/options')
}

function renderBankTransferMethod (req, res) {
  res.render('payment/bank-transfer')
}

function renderCardMethod (req, res) {
  res.render('payment/card')
}

module.exports = {
  renderPaymentOptions,
  renderBankTransferMethod,
  renderCardMethod,
}
