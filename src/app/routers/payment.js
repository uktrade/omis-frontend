const router = require('express').Router()

const {
  renderPaymentOptions,
  handlePaymentOptions,
  renderCardMethod,
  renderBankTransferMethod,
} = require('../controllers/payment')

router
  .route('/')
  .get(renderPaymentOptions)
  .post(handlePaymentOptions)

router.get('/card', renderCardMethod)
router.get('/bank-transfer', renderBankTransferMethod)

module.exports = router
