import { bind } from 'redux-effects';
import { fetch } from 'redux-effects-fetch';
import { registerActionTypes } from '../state/actions-registry';
import { dataFetched } from '../state/fetch-data/actions';

const registeredActions = registerActionTypes( 'WC_API', [
	'INIT',

	'FETCH_PRODUCT_CATEGORIES',
	'FETCHING_PRODUCT_CATEGORIES',
	'FETCHED_PRODUCT_CATEGORIES',
	'ERROR_FETCH_PRODUCT_CATEGORIES',

	'UPDATE_PRODUCT',
	'UPDATING_PRODUCT',
	'UPDATED_PRODUCT',
	'ERROR_UPDATE_PRODUCT',
	'BATCH_PRODUCTS_UPDATE',
	'API_ERROR',
] );

export const SERVICE = 'wc-api-redux';
const TYPES = registeredActions.types;
const ACTIONS = registeredActions.actions;

export function initialize( baseUrl, nonce ) {
	return ACTIONS.INIT( { baseUrl, nonce } );
}

/**
 * Fetches all product categories.
 *
 * See http://woocommerce.github.io/woocommerce-rest-api-docs/#list-all-product-categories
 *
 */
export function fetchProductCategories() {
	// TODO: Handle per_page loading
	// TODO: Allow to get all through multiple page requests (for when there are LOTS of categories)
	return ACTIONS.FETCH_PRODUCT_CATEGORIES();
}

/**
 * Performs API Batch Update of Products.
 *
 * See http://woothemes.github.io/woocommerce-rest-api-docs/#batch-update-products
 *
 * @param edits Object matching API format
 */
export function batchUpdateProducts( edits, successAction, failureAction ) {
	return ACTIONS.BATCH_PRODUCTS_UPDATE( { edits, successAction, failureAction } );
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
	[ TYPES.FETCH_PRODUCT_CATEGORIES ]: ( action, store, context ) => {

		if ( checkInit( context, store.dispatch ) ) {
			const query = '/products/categories';

			store.dispatch( [
				ACTIONS.FETCHING_PRODUCT_CATEGORIES(),
				createRequest(
					context,
					query,
					'GET',
					null,
					( data ) => dataFetched( SERVICE, query, data ),
					ACTIONS.ERROR_FETCH_PRODUCT_CATEGORIES
				)
			] );
		}
	},
	[ TYPES.UPDATE_PRODUCT ]: ( action, store, context ) => {

		if ( checkInit( context, store.dispatch ) ) {
			const { product } = action.payload;

			store.dispatch( [
				ACTIONS.UPDATING_PRODUCT( product ),
				createRequest(
					context,
					'/products/' + product.id,
					'PUT',
					product,
					ACTIONS.UPDATED_PRODUCT,
					ACTIONS.ERROR_UPDATE_PRODUCT
				)
			] );
		}
	},
	[ TYPES.BATCH_PRODUCTS_UPDATE ]: ( action, store, context ) => {
		const { edits, successAction, failureAction } = action.payload;

		if ( checkInit( context, store.dispatch, failureAction ) ) {

			store.dispatch( [
				createRequest(
					context,
					'/products/batch',
					'POST',
					edits,
					successAction,
					failureAction
				)
			] );
		}
	}
}

function checkInit( context, dispatch, failureAction ) {
	if ( context.baseUrl && context.nonce ) {
		return true;
	} else {
		const msg = 'wc-api-middleware must be initialized.';
		dispatch( ACTIONS.API_ERROR( msg ) );
		if ( failureAction ) {
			dispatch( failureAction( msg ) );
		}
		return false;
	}
}

function createRequest( context, url, method, data, successAction, failureAction ) {
	let credentials = 'same-origin';
	let headers = new Headers();
	headers.set( 'x-wp-nonce', context.nonce );

	let params = { method, credentials, headers };

	if ( 'POST' === method || 'PUT' === method ) {
		headers.set( 'Content-Type', 'application/json' );
		params.body = JSON.stringify( data );
	}

	return bind(
		fetch( context.baseUrl + url, params ),
		( { value } ) => successAction( value ),
		( { value } ) => failureAction( value )
	);
}

