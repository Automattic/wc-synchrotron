import { expect } from 'chai';

import { updateWhen } from '../';

// Constants used in the tests below.
const service = 'my-service';
const endpoint = 'my/endpoint';

function fetchActionSuccess( service, key, data ) {
	// Simulates a successful API fetch.
	return {
		type: 'WC_FETCH_DATA_FETCHED',
		payload: { service, key, data }
	};
}

function fetchActionError( service, key, error ) {
	// Simulates a failed API fetch.
	return {
		type: 'WC_FETCH_DATA_ERROR',
		payload: { service, key, error }
	};
}

function createFetch( query, defaultValue, fetchValue ) {
	const key = endpoint + query;

	return {
		service,
		key,
		defaultValue,
		shouldUpdate: updateWhen.notFetched(),
		action: ( state ) => {
			return fetchActionSuccess( service, key, fetchValue );
		}
	}
}

describe( 'fetch-data', () => {
	describe( '#updateWhen', () => {

		describe( '#notFetched()', () => {
			const query = '?q=x';
			const defaultValue = [];
			const fetchValue = [ 1, 2, 3 ];

			const fetch = createFetch( query, defaultValue, fetchValue );

			it( 'should check for state data', () => {
				expect( fetch.shouldUpdate( fetch, { data: defaultValue } ) ).to.be.true;
				expect( fetch.shouldUpdate( fetch, { data: fetchValue, lastFetchTime: Date.now() } ) ).to.be.false;
			} );
		} );
	} );
} );

