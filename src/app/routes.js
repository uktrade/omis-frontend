const indexController = require( './controllers/index' );

module.exports = function( express, app, isDev ){
	app.get( '/', indexController );
};
