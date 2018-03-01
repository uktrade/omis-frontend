const router = require('express').Router()

const { renderOrderSummary } = require('../controllers/order')
const { renderQuote, renderAcceptedQuote, acceptQuote } = require('../controllers/quote')
const { renderInvoice } = require('../controllers/invoice')
const { renderReceipt } = require('../controllers/receipt')

router.get('/', renderOrderSummary)

router
  .route('/quote')
  .get(renderQuote)
  .post(acceptQuote, renderQuote)

router.get('/quote/accepted', renderAcceptedQuote)

router.get('/invoice', renderInvoice)

router.get('/receipt', renderReceipt)

module.exports = router
