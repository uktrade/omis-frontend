const router = require('express').Router()

const indexController = require('./controllers/index')
const { renderPingdomXml } = require('./controllers/healthcheck')
const { renderOrderSummary } = require('./controllers/order')
const { renderQuote, renderAcceptedQuote, acceptQuote } = require('./controllers/quote')
const { renderInvoice } = require('./controllers/invoice')
const { renderReceipt } = require('./controllers/receipt')
const { fetchOrderDetails } = require('./middleware/order')
const { setAuthToken } = require('./lib/api')

// NOTE: ping has to be defined before the auth token middleware
router.get('/ping.xml', renderPingdomXml)

router.use(setAuthToken())

router.get('/', indexController)

router.param('publicToken', fetchOrderDetails)

router.get('/:publicToken', renderOrderSummary)

router
  .route('/:publicToken/quote')
  .get(renderQuote)
  .post(acceptQuote, renderQuote)

router.get('/:publicToken/quote/accepted', renderAcceptedQuote)

router.get('/:publicToken/invoice', renderInvoice)

router.get('/:publicToken/receipt', renderReceipt)

module.exports = router
