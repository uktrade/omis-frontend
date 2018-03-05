const router = require('express').Router()

const {
  renderPaymentOptions,
  handlePaymentOptions,
  renderCardMethod,
  renderBankTransferMethod,
} = require('../controllers/payment')
const {
  checkOrderStatus,
  checkPaidStatus,
  createPaymentGatewaySession,
} = require('../middleware/payment')

router.use(checkOrderStatus, checkPaidStatus)

router
  .route('/')
  .get(renderPaymentOptions)
  .post(handlePaymentOptions)

router.get('/card', createPaymentGatewaySession, renderCardMethod)
router.get('/bank-transfer', renderBankTransferMethod)

module.exports = router
