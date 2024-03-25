const router = require('express').Router()

const orderRouter = require('./order')
const indexController = require('../controllers/index')
const renderCookies = require('../controllers/cookies')
const { renderPingdomXml } = require('../controllers/healthcheck')
const { fetchOrderDetails } = require('../middleware/order')

// NOTE: ping has to be defined before the auth token middleware
router.get('/pingdom/ping.xml', renderPingdomXml)
router.get('/cookies', renderCookies)
router.get('/', indexController)

router.param('publicToken', fetchOrderDetails)
router.use('/:publicToken', orderRouter)

module.exports = router
