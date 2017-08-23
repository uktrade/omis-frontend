const os = require( 'os' );

const cpus = ( os.cpus().length || 1 );
const defaultWorkers = ( cpus > 1 ? cpus - 1 : cpus );

function env( name, defaultValue ){
	return ( process.env[ name ] || defaultValue );
}

function bool( name, defaultValue ){
	return ( env( name, defaultValue ) + '' ) === 'true';
}

const isProd = env( 'NODE_ENV' ) === 'production';

const config = {
	isProd,
	isDev: !isProd,
	showErrors: !isProd,
	server: {
		host: env( 'SERVER_HOST', 'localhost' ),
		port: env( 'SERVER_PORT', env( 'PORT', 3000 ) ),
		workers: env( 'SERVER_WORKERS', env( 'WEB_CONCURRENCY', defaultWorkers ) )
	},
	views: {
		cache: bool( 'CACHE_VIEWS', true )
	},
	logLevel: env( 'LOG_LEVEL', 'warn' ),
	backend: {
		protocol: env( 'BACKEND_PROTOCOL', 'http' ),
		host: env( 'BACKEND_HOST', 'localhost' ),
		port: env( 'BACKEND_PORT', 8000 )
	}
};

config.backend.href = `${config.backend.protocol}://${config.backend.host}:${config.backend.port}`;

module.exports = config;
