import { bind } from 'redux-effects';
import { fetch } from 'redux-effects-fetch';
import { registerActionTypes } from '../actions-registry';

const registered = registerActionTypes( 'WC_PRODUCTS', [
	'FETCHING',
	'FETCHED',
	'SET_ERROR',
] );

export const TYPES = registered.types;
const ACTIONS = registered.actions;

export function fetchProducts( url, nonce ) {
	let headers = new Headers();
	headers.set( 'x-wp-nonce', nonce );

	return [
		ACTIONS.FETCHING(),
		bind(
			fetch( url, { method: 'GET', credentials: 'same-origin', headers } ),
			( { value } ) => ACTIONS.FETCHED( value ),
			( { value } ) => ACTINOS.SET_ERROR( value )
		)
	];
}

