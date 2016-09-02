import { bind } from 'redux-effects';
import { fetch } from 'redux-effects-fetch';
import { registerActionTypes } from '../actions-registry';

const registered = registerActionTypes( 'WC_PRODUCTS', [
	'FETCHING',
	'FETCHED',
	'INIT_EDITS',
	'CLEAR_EDITS',
	'ADD_PRODUCT',
	'UPDATE_PRODUCT',
	'DELETE_PRODUCT',
	'SET_DISPLAY_OPTION',
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
			( { value } ) => ACTIONS.SET_ERROR( value )
		)
	];
}

export function initEdits() {
	return ACTIONS.INIT_EDITS();
}

export function cancelEdits() {
	return ACTIONS.CLEAR_EDITS();
}

export function saveEdits() {
	// TODO: Make this save using the API asynchronously.
	// Need to reconcile any outstanding updates, adds, and deletes.
	return ACTIONS.CLEAR_EDITS();
}

export function addProduct() {
	return ACTIONS.ADD_PRODUCT();
}

export function updateProduct( index, data ) {
	return ACTIONS.UPDATE_PRODUCT( { index, data } );
}

export function deleteProduct( id ) {
	return ACTIONS.DELETE_PRODUCT( id );
}

export function setDisplayOption( option, value ) {
	return ACTIONS.SET_DISPLAY_OPTION( { option, value } );
}

