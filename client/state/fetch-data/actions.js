import { bind } from 'redux-effects';
import { fetch } from 'redux-effects-fetch';
import { registerActionTypes } from '../actions-registry';

const registered = registerActionTypes( 'WC_FETCH_DATA', [
	'FETCHING',
	'FETCHED',
	'CLEAR',
	'ERROR',
] );

export const TYPES = registered.types;
const ACTIONS = registered.actions;

/**
 * @summary Creates a fetch action.
 *
 * This should be used when implementing your own API with fetch-data.
 * It provides a declarative way to do a standard HTTP request.
 *
 * @param { String } service Name of service from which you are fetching.
 * @param { String } key Describes unique key for this fetch ( e.g. query string )
 * @param { String } url The actual complete URL to HTTP fetch.
 * @param { Object } params The HTTP params/options to use for the fetch.
 */
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

/**
 * @summary Clears data for a given service/key combination.
 *
 * This function should only be used by the fetch-data maintenance code.
 * It removes ( presumably stale ) fetched data from the redux store.
 *
 * @param { String } service Name of service for key to be cleared.
 * @param { String } key Unique key of data to be cleared.
 */
export function clearData( service, key ) {
	return ACTIONS.CLEAR( { service, key } );
}

/**
 * @summary Denotes an error on a given fetch.
 *
 * This stores error data about a failed fetch.
 * In most cases, you shouldn't need this and should use fetchAction instead.
 *
 * @param { String } service Name of service to which the fetch belongs.
 * @param { String } key Describes unique key for this fetch ( e.g. query string )
 * @param { Object } error Descriptive error object.
 */
export function fetchError( service, key, error ) {
	return ACTIONS.ERROR( { service, key, error } );
}

