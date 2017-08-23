const config = require( '../config' );
const logger = require( '../lib/logger' );

module.exports = {

	handle404: function( req, res ){

		res.status( 404 );
		res.render( 'errors/404' );
	},

	catchAll: function( err, req, res, next ){

		if( res.headersSent ){

			next( err );

		} else {

			res.status( 500 );
			res.render( 'errors/default', { error: err, showErrors: config.showErrors } );
		}

		logger.error( 'Somthing went wrong: ', err );
	}
};
