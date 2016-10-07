import { expect } from 'chai';

import { getData } from '../';

describe( 'fetch-data', () => {
	describe( '#getData()', () => {
		it( 'should fetch stored data', () => {
			const myData = { name: 'myData', value1: 1, value2: 2.2, value3: -3.33 };
			const state = {
				myService: {
					myQuery: myData
				}
			};

			const result = getData( 'myService', 'myQuery', state );

			expect( result ).to.equal( myData );
		} );

		it( 'should return null if query not found', () => {
			const state = {
			};

			const result = getData( 'myService', 'myQuery', state );

			expect( result ).to.be.null;
		} );
	} );
} );

