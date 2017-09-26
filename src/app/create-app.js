const express = require( 'express' );
const nunjucks = require( 'nunjucks' );
const njkMarkdown = require('nunjucks-markdown');
const md = require('markdown-it')({
  html: true,
  typographer: true,
});
const path = require( 'path' );
const morganLogger = require( 'morgan' );
const compression = require( 'compression' );
const session = require( 'express-session' );
const MemoryStore = require( 'memorystore' )(session);

const router = require( './router' );
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

	const nunjucksEnv = nunjucks.configure( [
			`${__dirname}/views`
		], {
		autoescape: true,
		watch: isDev,
		noCache: !config.views.cache,
		express: app
	} );

	// Add markdown support
	njkMarkdown.register(nunjucksEnv, (body) => {
		return md.render(body);
	});

	reporter.setup( app );

	if( !isDev ){
		app.use( compression() );
		//staticMaxAge = '2y';
	}

  app.use(session({
    store: new MemoryStore({
      checkPeriod: 86400000,
    }),
    secret: 'keyboard cat',
  }));

	app.use( forceHttps( isDev ) );
	app.use( '/public', express.static( pathToPublic, { maxAge: staticMaxAge } ) );
	app.use( morganLogger( ( isDev ? 'dev' : 'combined' ) ) );
	app.use( headers( isDev ) );
	app.use( ping );

  app.use( router );

	app.use( errors.handle404 );

	reporter.handleErrors( app );

	app.use( errors.catchAll );

	return app;
};
