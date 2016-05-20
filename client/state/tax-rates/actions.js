import { bind } from 'redux-effects';
import { fetch } from 'redux-effects-fetch';
import { createAction } from 'redux-actions';
import screenData from '../../utils/screen-data';

/**
 * These are the actions we are defining.
 */
const taxRatesFetching = createAction( 'WC_TAX_RATES_FETCHING' );
const taxRatesFetched  = createAction( 'WC_TAX_RATES_FETCHED' );
const taxRatesError    = createAction( 'WC_TAX_RATES_SET_ERROR' );
const taxRatesUpdating = createAction( 'WC_TAX_RATES_UPDATING' );
const taxRatesUpdated  = createAction( 'WC_TAX_RATES_UPDATED' );

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
 * Bound to taxRatesFetching action.
 * @return array
 */
export function fetchTaxRates() {
	return [
		taxRatesFetching(),
		bind(
			fetch( data.endpoints.taxes, { method: 'GET', credentials: 'same-origin', headers: getRequestHeaders() } ),
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

/**
 * Function which stores tax rates to the server/API.
 * Bound to taxRatesUpdating action.
 * @param  object rates to store
 * @return array
 */
export function updateTaxRates( taxRates ) {
	return [
		taxRatesUpdating(),
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
			( { value } ) => taxRatesUpdated( value ),
			( { value } ) => taxRatesError( value )
		)
	];
}
