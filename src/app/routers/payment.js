const router = require('express').Router()

const {
  renderPaymentOptions,
  handlePaymentOptions,
  renderCardMethod,
  renderBankTransferMethod,
  renderCardFailure,
  renderCardSuccess,
} = require('../controllers/payment')
const {
  checkOrderStatus,
  checkPaidStatus,
  createPaymentGatewaySession,
  setPaymentGatewaySession,
} = require('../middleware/payment')

router.use(checkOrderStatus, checkPaidStatus)

router
  .route('/')
  .get(renderPaymentOptions)
  .post(handlePaymentOptions)

router.get('/bank-transfer', renderBankTransferMethod)

router.get('/card',
  createPaymentGatewaySession,
  setPaymentGatewaySession,
  renderCardMethod
)
router.get('/card/failure', renderCardFailure)
router.get('/card/success', renderCardSuccess)

module.exports = router
