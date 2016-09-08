import { bind } from 'redux-effects';
import { fetch } from 'redux-effects-fetch';
import { registerActionTypes } from '../actions-registry';
import { wcApi } from '../../wc-api-redux';

const registered = registerActionTypes( 'WC_PRODUCTS', [
	'FETCHING',
	'FETCHED',
	'INIT_EDITS',
	'CLEAR_EDITS',
	'SAVING_EDITS',
	'EDITS_SAVED',
	'ADD_PRODUCT',
	'EDIT_PRODUCT',
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

export function saveEdits( edits ) {
	return ACTIONS.SAVING_EDITS();
}

export function addProduct() {
	return ACTIONS.ADD_PRODUCT();
}

export function editProduct( index, data ) {
	return ACTIONS.EDIT_PRODUCT( { index, data } );
}

export function deleteProduct( id ) {
	return ACTIONS.DELETE_PRODUCT( id );
}

export function setDisplayOption( option, value ) {
	return ACTIONS.SET_DISPLAY_OPTION( { option, value } );
}

