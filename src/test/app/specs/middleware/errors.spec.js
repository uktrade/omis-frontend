const proxyquire = require( 'proxyquire' );

describe( 'errors middleware', function(){

	let err;
	let req;
	let res;
	let next;
	let config;
	let middleware;
	let logger;

	beforeEach( function(){

		req = {};
		res = {
			status: jasmine.createSpy( 'res.status' ),
			render: jasmine.createSpy( 'res.render' )
		};
		next = jasmine.createSpy( 'next' );

		config = {
			showErrors: false
		};
		logger = {
			error: jasmine.createSpy( 'logger.error' )
		};

		middleware = proxyquire( '../../../../app/middleware/errors', {
			'../config': config,
			'../lib/logger': logger
		} );
	} );

	describe( 'Errors middleware', function(){

		describe( 'catchAll', function(){

			beforeEach( function(){

				err = new Error( 'test' );
			} );

			describe( 'When the headers have been sent', function(){

				it( 'Should call the next handler with the error', function(){

					res.headersSent = true;

					middleware.catchAll( err, req, res, next );

					expect( res.status ).not.toHaveBeenCalled();
					expect( res.render ).not.toHaveBeenCalled();
					expect( logger.error ).not.toHaveBeenCalled();
					expect( next ).toHaveBeenCalledWith( err );
				} );
			} );

			describe( 'When the headers have not been sent', function(){
				describe('When error code is EBADCSRFTOKEN', function() {
					it( 'Should log the error and send a response with the right status code', function(){
						err.code = 'EBADCSRFTOKEN';

						middleware.catchAll( err, req, res, next );

						expect( res.status ).toHaveBeenCalledWith( 500 );
						expect( res.render ).toHaveBeenCalledWith( 'errors/default', { statusMessage: 'This form has been tampered with', showErrors: config.showErrors, error: err } );
						expect( logger.error ).toHaveBeenCalled();
						expect( next ).not.toHaveBeenCalled();
					} );
				});

				describe('When error code is anything else', function() {
					it( 'Should log the error and send a response with the right status code', function(){

						middleware.catchAll( err, req, res, next );

						expect( res.status ).toHaveBeenCalledWith( 500 );
						expect( res.render ).toHaveBeenCalledWith( 'errors/default', { statusMessage: 'Something has gone wrong', showErrors: config.showErrors, error: err } );
						expect( logger.error ).toHaveBeenCalled();
						expect( next ).not.toHaveBeenCalled();
					} );
				});

			} );

		} );

		describe( '404', function(){

			it( 'Should render the 404 page and send the right status code', function(){

				middleware.handle404( req, res, next );

				expect( res.status ).toHaveBeenCalledWith( 404 );
				expect( res.render ).toHaveBeenCalledWith( 'errors/404' );
				expect( next ).not.toHaveBeenCalled();
			} );
		} );
	} );
} );
