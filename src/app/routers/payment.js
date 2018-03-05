const router = require('express').Router()

const {
  renderPaymentOptions,
  handlePaymentOptions,
  renderCardMethod,
  renderBankTransferMethod,
  renderCardFailure,
  renderCardSuccess,
  redirectReturnUrl,
} = require('../controllers/payment')
const {
  checkOrderStatus,
  checkPaidStatus,
  createPaymentGatewaySession,
  setPaymentGatewaySession,
  checkPaymentGatewaySessionStatus,
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
  checkPaymentGatewaySessionStatus,
  renderCardMethod
)
router.get('/card/:paymentSessionId',
  validatePaymentGatewaySession,
  setPaymentGatewaySession,
  checkPaymentGatewaySessionStatus,
  redirectReturnUrl
)
router.get('/card/failure', renderCardFailure)
router.get('/card/success', renderCardSuccess)

module.exports = router
