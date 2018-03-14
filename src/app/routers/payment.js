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
  validatePaymentGatewaySession,
} = require('../middleware/payment')

router.use(checkOrderStatus)

router.get('/card/failure', renderCardFailure)
router.get('/card/success', renderCardSuccess)
router.get('/card/:paymentSessionId',
  validatePaymentGatewaySession,
  setPaymentGatewaySession,
  checkPaymentGatewaySessionStatus,
  redirectReturnUrl
)

// Placed specifically to prevent beginning of journey
// being access if order has been paid
router.use(checkPaidStatus)

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

module.exports = router
