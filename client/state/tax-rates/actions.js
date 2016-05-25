import { bind } from 'redux-effects';
import { fetch } from 'redux-effects-fetch';
import screenData from '../../utils/screen-data';
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
 * Get data from WordPress which contains endpoint information.
 */
const data = screenData( 'wc_synchrotron_data' );

/**
 * Get headers for API calls.
 * @return Headers
 */
function getRequestHeaders() {
	let headers = new Headers();
	headers.set( 'x-wp-nonce', data.nonce );
	headers.set( 'Accept', 'application/json' );
	headers.set( 'Content-Type', 'application/json' );
	return headers;
}

/**
 * Function which fetches tax rates from the server/API.
 * Bound to fetching action.
 * @return array
 */
export function fetchTaxRates() {
	return [
		ACTIONS.FETCHING(),
		bind(
			fetch( data.endpoints.taxes, { method: 'GET', credentials: 'same-origin', headers: getRequestHeaders() } ),
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
 * @param  object rates to store
 * @return array
 */
export function updateTaxRates( taxRates ) {
	return [
		ACTIONS.UPDATING(),
		bind(
			fetch(
				data.endpoints.taxes + '/update_items',
				{
					method: 'POST',
					credentials: 'same-origin',
					headers: getRequestHeaders(),
					body: JSON.stringify( taxRates ),
				}
			),
			( { value } ) => ACTIONS.UPDATED( value ),
			( { value } ) => ACTIONS.SET_ERROR( value )
		)
	];
}
