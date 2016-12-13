import { expect } from 'chai';

import reducer from '../reducer';
import { dataFetched } from '../actions';

describe( 'fetch-data/reducer', () => {
	it( 'should have an empty initial state', () => {
		const state = reducer( undefined, {} );
		expect( state ).to.be.empty;
	} );

	describe( '#dataFetched()', () => {
		it( 'should store new string', () => {
			const stateIn = {};
			const action = dataFetched( 'myService', 'myQuery', 'myString' );
			const stateOut = reducer( stateIn, action );

			expect( stateOut.myService ).to.exist;
			expect( stateOut.myService.myQuery.data ).to.equal( 'myString' );
		} );

		it( 'should store new object', () => {
			const myObject = { name: 'myObject', value1: 1, value2: 2.2, value3: -3.3 };

			const stateIn = {};
			const action = dataFetched( 'myService', 'myQuery', myObject );
			const stateOut = reducer( stateIn, action );

			expect( stateOut.myService ).to.exist;
			expect( stateOut.myService.myQuery.data ).to.equal( myObject );
		} );

		it( 'should store updated object', () => {
			const myObject1 = { name: 'myObject1', value1: 1, value2: 2.2, value3: -3.3 };
			const myObject2 = { name: 'myObject2', value1: 11, value2: 22.2, value3: -33.3 };

			const state0 = {};
			const action1 = dataFetched( 'myService', 'myQuery', myObject1 );
			const state1 = reducer( state0, action1 );
			const action2 = dataFetched( 'myService', 'myQuery', myObject2 );
			const state2 = reducer( state1, action2 );

			expect( state1.myService ).to.exist;
			expect( state1.myService.myQuery.data ).to.equal( myObject1 );

			expect( state2.myService ).to.exist;
			expect( state2.myService.myQuery.data ).to.equal( myObject2 );
		} );
	} );
} );

