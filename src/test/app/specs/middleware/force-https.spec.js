
const forceHttps = require( '../../../../app/middleware/force-https' );

const forwardHeader = 'x-forwarded-proto';

describe( 'force-https middleware', function(){

	let req;
	let res;
	let next;
	let redirect;
	let get;
	let url;

	beforeEach( function(){

		redirect = jasmine.createSpy( 'res.redirect' );
		get = jasmine.createSpy( 'req.get' ).and.callFake( () => 'test.com' );
		url = '/test/';
		next = jasmine.createSpy( 'next' );

		req = {
			headers: {},
			url,
			get
		};

		res = {
			redirect
		};
	} );

	describe( 'In dev mode', function(){

		it( 'Should call next', function(){

			const middleware = forceHttps( true );
			middleware( req, res, next );

			expect( next ).toHaveBeenCalled();
		} );
	} );

	describe( 'Not in dev mode', function(){

		describe( 'When the header is defined', function(){

			describe( 'When the header is http', function(){

				it( 'Should redirect to https', function(){

					const middleware = forceHttps( false );
					req.headers[ forwardHeader ] = 'http';
					middleware( req, res, next );
					expect( res.redirect ).toHaveBeenCalledWith( 'https://test.com/test/' );
				} );
			} );

			describe( 'When the header is https', function(){

				it( 'Should call next', function(){

					const middleware = forceHttps( false );
					req.headers[ forwardHeader ] = 'https';
					middleware( req, res, next );
					expect( next ).toHaveBeenCalled();
				} );
			} );
		} );

		describe( 'When the header is not defined', function(){

			it( 'Should call next', function(){

				const middleware = forceHttps( false );
				middleware( req, res, next );
				expect( next ).toHaveBeenCalled();
			} );
		} );
	} );
} );
