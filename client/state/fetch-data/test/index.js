import { expect } from 'chai';

import { updateWhen, FetchData } from '../';

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

	describe( 'FetchData', () => {
		describe( '#subscribe() and #unsubscribe()', () => {
			const fetch = createFetch( '?query', [], [ 4, 5, 6 ] );

			it( 'should subscribe successfully.', () => {
				const fetchData = new FetchData();
				const subscribeCall = () => {
					fetchData.subscribe( fetch );
				}

				expect( subscribeCall ).to.not.throw( Error );
			} );

			it( 'should return a handle.', () => {
				const fetchData = new FetchData();
				const handle = fetchData.subscribe( fetch );

				expect( handle ).to.exist;
				expect( handle ).to.be.an( 'object' );
			} );

			it( 'should provide redux state selectors.', () => {
				const fetchData = new FetchData();
				const handle = fetchData.subscribe( fetch );
				const fetchValue = [ 'fetch', 'value' ];
				const fetchStatus = { lastFetchTime: 123, lastSuccessTime: 124 };
				const state = {
					'fetchData': {
						[ fetch.service ]: {
							[ fetch.key ]: {
								value: fetchValue,
								status: fetchStatus,
							}
						}
					}
				};

				expect( handle.value ).to.be.a( 'function' );
				expect( handle.value( state ) ).to.equal( fetchValue );

				expect( handle.status ).to.be.a( 'function' );
				expect( handle.status( state ) ).to.equal( fetchStatus );
			} );

			it( 'should provide an unsubscribe function.', () => {
				const fetchData = new FetchData();
				const handle = fetchData.subscribe( fetch );
				const unsubscribeCall = () => {
					handle.unsubscribe()
				};

				expect( handle.unsubscribe ).to.be.a( 'function' );
				expect( unsubscribeCall ).to.not.throw( Error );
			} );

			it( 'should allow a subscribe after an unsubscribe.', () => {
				const fetchData = new FetchData();
				const handle = fetchData.subscribe( fetch );
				const subscribeCall = () => {
					fetchData.subscribe( fetch );
				};
				const unsubscribeCall = () => {
					handle.unsubscribe()
				};

				expect( handle.unsubscribe ).to.be.a( 'function' );
				expect( unsubscribeCall ).to.not.throw( Error );
				expect( subscribeCall ).to.not.throw( Error );
			} );

			it( 'should throw Error upon invalid unsubscribe', () => {
				const fetchData = new FetchData();
				const unsubscribeCall = () => {
					fetchData.unsubscribe( fetch )
				};

				expect( unsubscribeCall ).to.throw( Error );
			} );

			it( 'should throw Error upon invalid subscribe', () => {
				const fetchData = new FetchData();
				const subscribeCall = () => {
					fetchData.subscribe( fetch );
				};

				expect( subscribeCall ).to.not.throw( Error );
				expect( subscribeCall ).to.throw( Error );
			} );
		} );
	} );
} );

