import { handleActions } from 'redux-actions';

/**
 * Inital state before the user does anything with the data.
 * @type object
 */
export const initialState = {
	isFetching: false,
	isFetched : false,
	error     : null,
	taxRates  : [],
	editing   : {},
};

/**
 * This maps our actions (inside actions.js) to reducer functions.
 * Action name => Callback
 */
export default handleActions( {
	WC_TAX_RATES_FETCHING : taxRatesFetching,
	WC_TAX_RATES_FETCHED  : taxRatesFetched,
	WC_TAX_RATES_SET_ERROR: taxRatesError,
}, initialState );

/**
 * When begining to fetch rates, sets state object to reflect this.
 */
export function taxRatesFetching( state ) {
	return Object.assign( {}, state, {
		isFetching: true,
		isFetched : false,
		error     : null,
	} );
}

/**
 * When rates have been fetched, sets state object to reflect this and sets
 * payload.
 */
export function taxRatesFetched( state, action ) {
	return Object.assign( {}, state, {
		isFetching: false,
		isFetched : true,
		error     : null,
		taxRates  : action.payload,
	} );
}

/**
 * If there was an error, sets the error property so it can be displayed in
 * the UI somewhere.
 */
export function taxRatesError( state, action ) {
	return Object.assign( {}, state, {
		isFetching: false,
		isFetched : false,
		error     : action.payload,
	} );
}
