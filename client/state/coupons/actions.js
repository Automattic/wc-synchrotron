import { bind } from 'redux-effects';
import { fetch } from 'redux-effects-fetch';
import { registerActionTypes, createActions } from '../actions-registry';

const registered = registerActionTypes( 'COUPONS', [
	'EDIT',
	'CANCEL_EDIT',
	'FETCHING',
	'FETCHED',
	'SET_ERROR',
] );

export const TYPES = registered.types;
const ACTIONS = registered.actions;

export function editCoupon( coupon, fieldName, fieldValue ) {
	return ACTIONS.EDIT( { coupon, fieldName, fieldValue } );
}

export function cancelCouponEdit( coupon ) {
	return ACTIONS.CANCEL_EDIT( coupon );
}

export function fetchCoupons( url, nonce ) {
	let headers = new Headers();
	headers.set( 'x-wp-nonce', nonce );

	return [
		ACTIONS.FETCHING(),
		bind(
			fetch( url, { method: 'GET', credentials: 'same-origin', headers } ),
			( { value } ) => ACTIONS.FETCHED( value ),
			( { value } ) => ACTIONS.SET_ERROR( value ),
		)
	];
}
