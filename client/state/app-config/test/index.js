import { expect } from 'chai';

import reducer, { getConfig, setConfig } from '../';

describe( 'app-config', () => {
	describe( '#setConfig()', () => {
		it( 'should set config string', () => {
			const stateIn = {};
			const action = setConfig( 'testString', 'stringValue' );
			const stateOut = reducer( stateIn, action );

			expect( stateOut.testString ).to.equal( 'stringValue' );
		} );

		it( 'should set config number', () => {
			const stateIn = {};
			const action = setConfig( 'testNumber', 3.5 );
			const stateOut = reducer( stateIn, action );

			expect( stateOut.testNumber ).to.equal( 3.5 );
		} );

		it( 'should set config object', () => {
			const testObject = { stringValue: 'objectString', number1: 1, number2: 2.2, number3: -3.3 };

			const stateIn = {};
			const action = setConfig( 'testObject', testObject );
			const stateOut = reducer( stateIn, action );

			expect( stateOut.testObject ).to.equal( testObject );
		} );
	} );

	describe( '#getConfig()', () => {
		it ( 'should get config value', () => {
			const testObject = { stringValue: 'objectString', number1: 1, number2: 2.2, number3: -3.3 };

			const state = { [ 'app-config' ]: { testValue: testObject } };
			const value = getConfig( state )( 'testValue' );

			expect( value ).to.equal( testObject );
		} );
	} );
} );

