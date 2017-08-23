const express = require( 'express' );
const nunjucks = require( 'nunjucks' );
const path = require( 'path' );
const morganLogger = require( 'morgan' );
const compression = require( 'compression' );

const routes = require( './routes' );
const config = require( './config' );
const reporter = require( './lib/reporter' );

const ping = require( './middleware/ping' );
const forceHttps = require( './middleware/force-https' );
const headers = require( './middleware/headers' );
const errors = require( './middleware/errors' );

module.exports = function(){

	const app = express();
	const env = app.get( 'env' );
	const isDev = ( 'development' === env );

	const pathToPublic = path.resolve( __dirname, '../public' );

	let staticMaxAge = 0;

	app.set( 'view engine', 'njk' );
	app.set( 'view cache', config.views.cache );

	app.disable( 'x-powered-by' );

	nunjucks.configure( [
			`${__dirname}/views`
		], {
		autoescape: true,
		watch: isDev,
		noCache: !config.views.cache,
		express: app
	} );

	reporter.setup( app );

	if( !isDev ){
		app.use( compression() );
		//staticMaxAge = '2y';
	}

	app.use( forceHttps( isDev ) );
	app.use( '/public', express.static( pathToPublic, { maxAge: staticMaxAge } ) );
	app.use( morganLogger( ( isDev ? 'dev' : 'combined' ) ) );
	app.use( headers( isDev ) );
	app.use( ping );

	routes( express, app, isDev );

	app.use( errors.handle404 );

	reporter.handleErrors( app );

	app.use( errors.catchAll );

	return app;
};
