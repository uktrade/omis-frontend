const indexController = require( '../../../../app/controllers/index' );

describe( 'Index controller', function(){

	it( 'Should render the index view', function(){

		const req = {};
		const res = {
			render: jasmine.createSpy( 'res.render' )
		};

		indexController( req, res );

		expect( res.render ).toHaveBeenCalledWith( 'index' );
	} );
} );
