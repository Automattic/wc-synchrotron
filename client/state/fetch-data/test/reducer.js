import { expect } from 'chai';

import reducer from '../reducer';
import { dataFetched, clearData } from '../actions';

describe( 'fetch-data/reducer', () => {
	it( 'should have an empty initial state', () => {
		const state = reducer( undefined, {} );
		expect( state ).to.be.empty;
	} );

	describe( '#dataFetching()', () => {
		it( 'should update lastFetchTime', () => {
			const stateIn = {};
			const action = { type: 'WC_FETCH_DATA_FETCHING', payload: { service: 'myService', key: 'myKey' } };
			const stateOut = reducer( stateIn, action );

			expect( stateOut[ 'myService' ] ).to.exist;
			expect( stateOut[ 'myService' ][ 'myKey' ] ).to.exist;
			expect( stateOut[ 'myService' ][ 'myKey' ].status ).to.exist;
			expect( stateOut[ 'myService' ][ 'myKey' ].status.lastFetchTime ).to.exist;
		} );
	} );

	describe( '#dataFetched()', () => {
		it( 'should store new string', () => {
			const stateIn = {};
			const action = dataFetched( 'myService', 'myKey', 'myString' );
			const stateOut = reducer( stateIn, action );

			expect( stateOut[ 'myService' ] ).to.exist;
			expect( stateOut[ 'myService' ][ 'myKey' ] ).to.exist;
			expect( stateOut[ 'myService' ][ 'myKey' ].value ).to.equal( 'myString' );
		} );

		it( 'should store new object', () => {
			const myObject = { name: 'myObject', value1: 1, value2: 2.2, value3: -3.3 };

			const stateIn = {};
			const action = dataFetched( 'myService', 'myKey', myObject );
			const stateOut = reducer( stateIn, action );

			expect( stateOut[ 'myService' ] ).to.exist;
			expect( stateOut[ 'myService' ][ 'myKey' ] ).to.exist;
			expect( stateOut[ 'myService' ][ 'myKey' ].value ).to.equal( myObject );
		} );

		it( 'should store updated object', () => {
			const myObject1 = { name: 'myObject1', value1: 1, value2: 2.2, value3: -3.3 };
			const myObject2 = { name: 'myObject2', value1: 11, value2: 22.2, value3: -33.3 };

			const state0 = {};
			const action1 = dataFetched( 'myService', 'myKey', myObject1 );
			const state1 = reducer( state0, action1 );
			const action2 = dataFetched( 'myService', 'myKey', myObject2 );
			const state2 = reducer( state1, action2 );

			expect( state1[ 'myService' ] ).to.exist;
			expect( state1[ 'myService' ][ 'myKey' ] ).to.exist;
			expect( state1[ 'myService' ][ 'myKey' ].value ).to.equal( myObject1 );

			expect( state2[ 'myService' ] ).to.exist;
			expect( state2[ 'myService' ][ 'myKey' ] ).to.exist;
			expect( state2[ 'myService' ][ 'myKey' ].value ).to.equal( myObject2 );
		} );
	} );

	describe( '#clearData()', () => {
		const service = 'myService1';

		const key1 = 'myKey1';
		const data1 = [ 1, 2, 3 ];

		const key2 = 'myKey2';
		const data2 = [ 4, 5, 6 ];

		const state0 = {
			[ service ]: {
				[ key1 ]: data1,
				[ key2 ]: data2,
			},
		};

		it( 'should clear out one key and leave the other', () => {
			const action1 = clearData( service, key1 );
			const state1 = reducer( state0, action1 );

			expect( state1[ service ] ).to.exist;
			expect( state1[ service ][ key1 ] ).to.not.exist;
			expect( state1[ service ][ key2 ] ).to.exist;
		} );

		it( 'should clear out the service if no keys are left', () => {
			const action1 = clearData( service, key1 );
			const state1 = reducer( state0, action1 );
			const action2 = clearData( service, key2 );
			const state2 = reducer( state1, action2 );

			expect( state2[ service ] ).to.not.exist;
		} );
	} );
} );

