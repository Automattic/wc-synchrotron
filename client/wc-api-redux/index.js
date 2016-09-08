import { bind } from 'redux-effects';
import { fetch } from 'redux-effects-fetch';
import { registerActionTypes } from '../state/actions-registry';

const registeredActions = registerActionTypes( 'WC_API', [
	'INIT',
	'UPDATE_PRODUCT',
	'UPDATING_PRODUCT',
	'UPDATED_PRODUCT',
	'ERROR_UPDATE_PRODUCT',
	'BATCH_PRODUCTS_UPDATE',
	'BATCH_PRODUCTS_UPDATING',
	'BATCH_PRODUCTS_UPDATED',
	'ERROR_BATCH_PRODUCTS_UPDATE',
	'API_ERROR',
] );

const TYPES = registeredActions.types;
const ACTIONS = registeredActions.actions;

export function initialize( baseUrl, nonce ) {
	return ACTIONS.INIT( { baseUrl, nonce } );
}

export function batchUpdateProducts( edits ) {
	return ACTIONS.BATCH_PRODUCTS_UPDATE( edits );
}

export function updateProduct( product ) {
	return ACTIONS.UPDATE_PRODUCT( product );
}

export default function createMiddleware() {
	let context = {};

	return ( store ) => ( next ) => ( action ) => {
		const handler = handlers[ action.type ];

		if ( handler ) {
			handler( action, store, context );
			return true;
		} else {
			return next( action );
		}
	};
}

const handlers = {
	[ TYPES.INIT ]: ( action, store, context ) => {
		const { baseUrl, nonce } = action.payload;

		context.baseUrl = baseUrl;
		context.nonce = nonce;
	},
	[ TYPES.UPDATE_PRODUCT ]: ( action, store, context ) => {

		if ( checkInit( context, store.dispatch ) ) {
			const { product } = action.payload;

			store.dispatch( [
				ACTIONS.UPDATING_PRODUCT( product ),
				createRequest(
					context,
					'/wp-json/wc/v1/products/' + product.id,
					'PUT',
					product,
					ACTIONS.UPDATED_PRODUCT,
					ACTIONS.ERROR_UPDATE_PRODUCT
				)
			] );
		}
	},
	[ TYPES.BATCH_PRODUCTS_UPDATE]: ( action, store, context ) => {

		if ( checkInit( context, store.dispatch ) ) {
			const { edits } = action.payload;

			store.dispatch( [
				ACTIONS.BATCH_PRODUCTS_UPDATING( product ),
				createRequest(
					context,
					'/wp-json/wc/v1/products/batch',
					'POST',
					edits,
					ACTIONS.BATCH_PRODUCTS_UPDATED,
					ACTIONS.ERROR_BATCH_PRODUCTS_UPDATE
				)
			] );
		}
	}
}

function checkInit( context, dispatch ) {
	if ( context.baseUrl && context.nonce ) {
		return true;
	} else {
		dispatch( ACTIONS.API_ERROR( 'wc-api-middleware must be initialized.' ) );
		return false;
	}
}

function createRequest( context, url, method, data, successAction, failureAction ) {
	let credentials = 'same-origin';
	let headers = new Headers();
	headers.set( 'x-wp-nonce', context.nonce );

	return bind(
		fetch( context.baseUrl + url, { method, credentials, headers } ),
		( { value } ) => successAction( value ),
		( { value } ) => failureAction( value )
	);
}

