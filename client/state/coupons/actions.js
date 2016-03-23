import { bind } from 'redux-effects';
import { fetch } from 'redux-effects-fetch';
import { createAction } from 'redux-actions';

// TODO: Make action names better prefixed, maybe some helper code to do this?
export const ACTION_NAMES = {
	COUPONS_FETCHING: 'COUPONS_FETCHING',
	COUPONS_FETCHED: 'COUPONS_FETCHED',
	COUPONS_SET_ERROR: 'COUPONS_SET_ERROR'
};

export function fetchCoupons( url, nonce ) {
	let headers = new Headers();
	headers.set( 'x-wp-nonce', nonce );

	console.log( url );
	console.log( headers );

	return [
		couponsFetching(),
		bind(
			fetch( url, { method: 'GET', credentials: 'same-origin', headers } ),
			( { value } ) => couponsFetched( value ),
			( { value } ) => setError( value )
		)
	];
}

const couponsFetching = createAction( ACTION_NAMES.COUPONS_FETCHING );
const couponsFetched = createAction( ACTION_NAMES.COUPONS_FETCHED );
const setError = createAction( ACTION_NAMES.COUPONS_SET_ERROR );
