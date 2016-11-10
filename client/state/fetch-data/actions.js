import { bind } from 'redux-effects';
import { fetch } from 'redux-effects-fetch';
import { registerActionTypes } from '../actions-registry';

const registered = registerActionTypes( 'WC_FETCH_DATA', [
	'FETCH',
	'FETCHING',
	'FETCHED',
	'ERROR',
] );
// TODO: Maybe add 'FETCH_ERROR' for universal fetch error tracking?

export const TYPES = registered.types;
const ACTIONS = registered.actions;

export function fetchAction( service, key, url, params ) {

	return [
		ACTIONS.FETCHING( { service, key } ),
		bind(
			fetch( url, params ),
			( { value } ) => dataFetched( service, key, value ),
			( { value } ) => fetchError( service, key, value )
		)
	];
}

/**
 * @summary Action creator: Stores fetched data for use within the app.
 *
 * This stores data by the service and key.
 *
 * @param { String } service Name of service to which the data belongs.
 * @param { String } key Describes uniquely what data was fetched.
 * @param { Any } data The data to be held in memory.
 * @return { Object } Action to be dispatched by redux.
 */
export function dataFetched( service, key, data ) {
	// TODO: Add timestamp and refresh rate functionality to keep data current.
	// TODO: Use timestamp to expire old data?
	return ACTIONS.FETCHED( { service, key, data } );
}

function fetchError( service, key, error ) {
	return ACTIONS.ERROR( { service, key, error } );
}

