import { bind } from 'redux-effects';
import { fetch } from 'redux-effects-fetch';
import { createAction } from 'redux-actions';

/**
 * These are the actions we are defining.
 */
const taxRatesFetching = createAction( 'WC_TAX_RATES_FETCHING' );
const taxRatesFetched  = createAction( 'WC_TAX_RATES_FETCHED' );
const taxRatesError    = createAction( 'WC_TAX_RATES_SET_ERROR' );

/**
 * Function which fetches tax rates from the server/API.
 * Bound to taxRatesFetching action.
 * @param  string url   Endpoint URL.
 * @param  string nonce Security nonce.
 * @return array
 */
export function fetchTaxRates( url, nonce ) {
	let headers = new Headers();
	headers.set( 'x-wp-nonce', nonce );

	return [
		taxRatesFetching(),
		bind(
			fetch( url, { method: 'GET', credentials: 'same-origin', headers } ),
			( { value } ) => taxRatesFetched( value ),
			( { value } ) => taxRatesError( value )
		)
	];
}

/**
 * This sets a field to value for a tax rate during editing.
 */
export function editTaxRate( taxRate, fieldName, fieldValue ) {
	return createAction( 'WC_TAX_RATES_EDIT' )( { taxRate, fieldName, fieldValue } );
}
