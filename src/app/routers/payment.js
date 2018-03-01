const router = require('express').Router()

const {
  renderPaymentOptions,
  renderCardMethod,
  renderBankTransferMethod,
} = require('../controllers/payment')

router.get('/', renderPaymentOptions)
router.get('/card', renderCardMethod)
router.get('/bank-transfer', renderBankTransferMethod)

module.exports = router
