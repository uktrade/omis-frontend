const router = require('express').Router();

const indexController = require( './controllers/index' );
const { renderQuote, renderAcceptedQuote, acceptQuote } = require( './controllers/quote' );
const { setAuthToken } = require( './lib/api' );

router.use(setAuthToken());

router.get('/', indexController);
router.get('/:publicToken', renderQuote);
router.get('/:publicToken/accepted', renderAcceptedQuote);
router.post('/:publicToken/accept', acceptQuote);

module.exports = router;
