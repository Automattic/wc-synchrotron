import { registerActionTypes } from '../actions-registry';

const registered = registerActionTypes( 'WC_FETCH_DATA', [
	'FETCHED',
] );
// TODO: Maybe add 'FETCH_ERROR' for universal fetch error tracking?

export const TYPES = registered.types;
const ACTIONS = registered.actions;

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

