import { expect } from 'chai';
import React from 'react';
import sd from 'skin-deep';
import { createMockStore } from 'redux-test-utils';

import { fetchConnect, updateWhen } from '../';
import reducer from '../reducer';

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

	describe( '#fetchConnect()', () => {
		const query1 = '?q=1';
		const query2 = '?q=2';
		const defaultValue = [];
		const initialValue = [ 1, 2, 3 ];
		const fetchValue = [ 1, 2.2, -3.33 ];

		function testFetch( query ) {
			return createFetch( query, defaultValue, fetchValue );
		}

		// Create a test component that uses the fetch.
		const TestComponent = ( props ) => {
			return (
				<div>
					<span>{ props.query }</span>
					<span>{ props.fetchResult }</span>
				</div>
			);
		};

		// Map the queryValue property on the test component.
		function mapFetchProps( props ) {
			return {
				fetchResult: testFetch( props.query )
			};
		}
		const FetchComponent = fetchConnect( mapFetchProps )( TestComponent );

		it( 'should map fetchResult to props', () => {
			const initialState = {
				fetchData: {
					[ service ]: {
						[ endpoint + query1 ]: {
							data: initialValue,
						}
					}
				}
			};

			const store = createMockStore( initialState );
			const props = { query: query1, store: store };

			// Render the test component
			const tree = sd.shallowRender( React.createElement( FetchComponent, props ) );
			tree.reRender( props );

			expect( tree.props.query ).to.equal( query1 );
			expect( tree.props.fetchResult.data ).to.equal( initialValue );
		} );

		it( 'should fetch when the query changes', () => {
			const initialState = {
				fetchData: {
					[ service ]: {
						[ endpoint + query1 ]: {
							data: initialValue,
						}
					}
				}
			};

			let store = createMockStore( initialState );
			const props = { query: query1, store: store };

			// Render the test component
			const tree = sd.shallowRender( React.createElement( FetchComponent, props ) );
			tree.reRender( props );
			tree.reRender( { query: query2, store } );

			expect( store.getActions() ).to.eql( [
				testFetch( query1 ).action( store.getState() ),
				testFetch( query2 ).action( store.getState() ),
			] );

			// Regenerate the store with a real reduced state for testing the resulting fetchResult property.
			initialState.fetchData = reducer( initialState.fetchData, store.getActions()[1] );

			// fetchConnect subscribes to the store's updates, but the mock doesn't do that.
			// so we have to update manually here.
			tree.reRender( { query: query2, store } );

			expect( tree.props.query ).to.equal( query2 );
			expect( tree.props.fetchResult.data ).to.equal( fetchValue );
		} );
	} );
} );

