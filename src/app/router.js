const router = require('express').Router();

const indexController = require( './controllers/index' );
const { setAuthToken } = require( './lib/api' );

router.use(setAuthToken());

router.get('/', indexController);

module.exports = router;
