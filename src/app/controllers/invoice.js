const { get } = require('lodash')

function renderInvoice(req, res, next) {
  const companyName = get(res.locals, 'invoice.invoice_company_name')

  if (!companyName) {
    return next()
  }

  res.render('invoice')
}

module.exports = {
  renderInvoice,
}
