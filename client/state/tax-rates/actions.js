import { bind } from 'redux-effects';
import { fetch } from 'redux-effects-fetch';
import { registerActionTypes } from '../actions-registry';

const registered = registerActionTypes( 'WC_TAX_RATES', [
	'FETCHING',
	'FETCHED',
	'EDIT',
	'SET_ERROR',
	'UPDATING',
	'UPDATED',
] );

export const TYPES = registered.types;
const ACTIONS = registered.actions;

/**
 * Get headers for API calls.
 * @param { string } nonce the WP API nonce to use
 * @return { Headers }
 */
function getRequestHeaders( nonce ) {
	let headers = new Headers();
	headers.set( 'x-wp-nonce', nonce );
	headers.set( 'Accept', 'application/json' );
	headers.set( 'Content-Type', 'application/json' );
	return headers;
}

/**
 * Function which fetches tax rates from the server/API.
 * Bound to fetching action.
 * @param { string } url The url to fetch for the API operation
 * @param { string } nonce the WP API nonce to use
 * @return { Array } Actions to be dispatched.
 */
export function fetchTaxRates( url, nonce ) {
	return [
		ACTIONS.FETCHING(),
		bind(
			fetch( url, { method: 'GET', credentials: 'same-origin', headers: getRequestHeaders( nonce ) } ),
			( { value } ) => ACTIONS.FETCHED( value ),
			( { value } ) => ACTIONS.SET_ERROR( value )
		)
	];
}

/**
 * This sets a field to value for a tax rate during editing.
 */
export function editTaxRate( taxRate, fieldName, fieldValue ) {
	return ACTIONS.EDIT( { taxRate, fieldName, fieldValue } );
}

/**
 * Function which stores tax rates to the server/API.
 * Bound to updating action.
 * @param { Object } object rates to store
 * @param { string } url The url to fetch for the API operation
 * @param { string } nonce the WP API nonce to use
 * @return { Array } Actions to be dispatched.
 */
export function updateTaxRates( taxRates, url, nonce ) {
	return [
		ACTIONS.UPDATING(),
		bind(
			fetch(
				url,
				{
					method: 'POST',
					credentials: 'same-origin',
					headers: getRequestHeaders( nonce ),
					body: JSON.stringify( taxRates ),
				}
			),
			( { value } ) => ACTIONS.UPDATED( value ),
			( { value } ) => ACTIONS.SET_ERROR( value )
		)
	];
}
