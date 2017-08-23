/* eslint no-console: 0 */

const CHILD_EXIT_LIMIT = 5;
const CHILD_EXIT_THRESHOLD = 60000; //1 minute

const childProcess = require( 'child_process' );
const pkg = require( '../../package.json' );

const appFile = '/app.js';
const childExits = [];
let child;

function createChildProcess(){

	child = childProcess.fork( __dirname + appFile );

	console.info( 'Child process created, pid: ' + child.pid );

	child.on( 'exit', handleChildExit );
}

function handleChildExit( e ){

	const now = Date.now();
	let exitsInLastMinute = 0;

	console.log( 'Child exits so far: %d', childExits.length );

	if( childExits.length >= CHILD_EXIT_LIMIT ){

		childExits.slice( -CHILD_EXIT_LIMIT ).forEach( function( item ){

			const delta = ( now - item );

			if( delta < CHILD_EXIT_THRESHOLD ){

				exitsInLastMinute++;
			}

		} );
	}

	console.log( 'Child exits in last minute: %d', exitsInLastMinute );

	if( exitsInLastMinute >= CHILD_EXIT_LIMIT ){

		console.log( 'Too many exits within the last minute, not spawning new child' );

	} else {

		console.error( 'Process terminated, restarting...', e );

		childExits.push( Date.now() );

		createChildProcess();
	}
}

function createErrorHandler( type ){

	return function(){

		console.log( 'Parent event: %s', type );

		if( child ){
			child.kill();
			child = null;
		}

		process.exit( 0 );
	};
}

process.on( 'unhandledException', createErrorHandler( 'unhandled exception' ) );
process.on( 'SIGTERM', createErrorHandler( 'SIGTERM' ) );
process.on( 'SIGINT', createErrorHandler( 'SIGINT' ) );
process.on( 'SIGQUIT', createErrorHandler( 'SIGQUIT' ) );
process.on( 'exit', createErrorHandler( 'exit' ) );

console.log( 'Starting ' + pkg.name + ', version: ' + pkg.version );

createChildProcess();
