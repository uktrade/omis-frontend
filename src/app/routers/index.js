const router = require('express').Router()

const orderRouter = require('./order')
const indexController = require('../controllers/index')
const { renderPingdomXml } = require('../controllers/healthcheck')
const { fetchOrderDetails } = require('../middleware/order')
const { setAuthToken } = require('../lib/api')

// NOTE: ping has to be defined before the auth token middleware
router.get('/ping.xml', renderPingdomXml)
router.get('/', indexController)

router.param('publicToken', fetchOrderDetails)

router.use(setAuthToken())
router.use('/:publicToken', orderRouter)

module.exports = router
