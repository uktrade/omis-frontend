const router = require('express').Router();

const indexController = require( './controllers/index' );
const { renderQuote } = require( './controllers/quote' );
const { setAuthToken } = require( './lib/api' );

router.use(setAuthToken());

router.get('/', indexController);
router.get('/:publicToken', renderQuote);

module.exports = router;
