import { handleActions } from 'redux-actions';

/**
 * Inital state before the user does anything with the data.
 * @type object
 */
export const initialState = {
	isFetching: false,
	isFetched : false,
	isUpdating: false,
	error     : null,
	taxRates  : [],
	editing   : {},
};

/**
 * This maps our actions (inside actions.js) to reducer functions.
 * Action name => Callback
 */
export default handleActions( {
	WC_TAX_RATES_FETCHING: taxRatesFetching,
	WC_TAX_RATES_FETCHED: taxRatesFetched,
	WC_TAX_RATES_SET_ERROR: taxRatesError,
	WC_TAX_RATES_EDIT: taxRatesEdit,
	WC_TAX_RATES_UPDATING: taxRatesUpdating,
	WC_TAX_RATES_UPDATED: taxRatesUpdated,
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

/**
 * Called when a tax rate is edited.
 */
export function taxRatesEdit( state, action ) {
	const { fieldName, fieldValue } = action.payload;
	let { taxRate } = action.payload;
	const key = taxRate.id;

	if ( fieldName ) {
		taxRate = Object.assign( {}, taxRate, { [fieldName]: fieldValue } );
	}

	const editing = Object.assign( {}, state.editing, {
		[key]: taxRate
	} );

	return Object.assign( {}, state, { editing } );
}

/**
 * When begining to update rates, sets state object to reflect this.
 */
export function taxRatesUpdating( state ) {
	return Object.assign( {}, state, {
		isUpdating: true,
		error     : null,
	} );
}

/**
 * When begining to update rates, sets state object to reflect this.
 */
export function taxRatesUpdated( state, action ) {
	return Object.assign( {}, state, {
		isUpdating: false,
		error     : null,
	} );
}
