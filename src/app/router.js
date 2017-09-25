const router = require('express').Router();

const indexController = require( './controllers/index' );

router.get( '/', indexController );

module.exports = router;
