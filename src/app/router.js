const router = require('express').Router()

const indexController = require('./controllers/index')
const { renderOrderSummary } = require('./controllers/order')
const { renderQuote, renderAcceptedQuote, acceptQuote } = require('./controllers/quote')
const { fetchOrderDetails } = require('./middleware/order')
const { setAuthToken } = require('./lib/api')

router.use(setAuthToken())

router.get('/', indexController)

router.param(':publicToken', fetchOrderDetails)

router.get('/:publicToken', renderOrderSummary)

router.get('/:publicToken/quote', renderQuote)
router.get('/:publicToken/quote/accepted', renderAcceptedQuote)
router.post('/:publicToken/quote/accept', acceptQuote)

module.exports = router
