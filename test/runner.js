import debug from 'debug';
import Mocha from 'mocha';
import path from 'path';
import program from 'commander';
import fs from 'fs';

const TEST_DIR_NAME = 'test';
const JS_EXTENSION = '.js';

const log = debug( 'test-runner' );
const rootDir = path.join( __dirname, '..' );

program
	.usage( '[options]' )
	.option( '-R, --reporter <name>', 'specify the reporter to use', 'spec' )
	.option( '-g, --grep <pattern>', 'only run tests matching <pattern>' )

program.name = 'runner';
program.parse( process.argv );

function findTestFiles( dir ) {
	let files = [];

	if ( TEST_DIR_NAME === path.basename( dir ) ) {
		// This is a 'tests' directory, include all .js files.
		files = files.concat( ...getFiles( dir, JS_EXTENSION ) );

	} else {
		// Otherwise, find all subdirectories and recurse.
		files = files.concat( ...searchSubdirs( dir ) );
	}

	return files;
}

function isValidDir( filePath ) {
	return !filePath.startsWith( '.' ) &&
	       fs.statSync( filePath ).isDirectory();
}

function searchSubdirs( dir ) {
	let files = [];

	fs.readdirSync( dir ).filter( ( fileName ) => {
		const filePath = path.join( dir, fileName );
		if ( isValidDir( filePath ) ) {
			files = files.concat( ...findTestFiles( filePath ) );
		}
	} );

	return files;
}

function getFiles( dir, extension ) {
	let files = [];

	fs.readdirSync( dir ).filter( ( fileName ) => {
		if ( '.js' === fileName.substr( -3 ) ) {
			const filePath = path.join( dir, fileName );
			files.push( filePath );
		}
	} );

	return files;
}

const mocha = new Mocha( {
	ui: 'bdd',
	reporter: program.reporter
} );

if ( program.grep ) {
	mocha.grep( new RegExp( program.grep ) );
}

const testFiles = findTestFiles( path.join( rootDir, process.env.TEST_ROOT ) );

testFiles.filter( ( testFile ) => {
	mocha.addFile( testFile );
} );

mocha.run( ( failures ) => {
	process.on( 'exit', () => {
		process.exit( failures ); // eslint-disable-line no-process-exit
	} );
} );

