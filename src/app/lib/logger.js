
const winston = require( 'winston' );
const config = require( '../config' );

const logger = new winston.Logger({
	level: config.logLevel,
	transports: [
		new winston.transports.Console( { colorize: config.isDev } )
	]
});

module.exports = logger;
