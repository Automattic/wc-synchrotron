import debug from 'debug';
import Mocha from 'mocha';
import path from 'path';
import program from 'commander';
import glob from 'glob';

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

const mocha = new Mocha( {
	ui: 'bdd',
	reporter: program.reporter
} );

if ( program.grep ) {
	mocha.grep( new RegExp( program.grep ) );
}

const testFiles = glob.sync( process.env.TEST_ROOT + '/**/test/*.js' );

testFiles.filter( ( testFile ) => {
	mocha.addFile( testFile );
} );

mocha.run( ( failures ) => {
	process.on( 'exit', () => {
		process.exit( failures ); // eslint-disable-line no-process-exit
	} );
} );

