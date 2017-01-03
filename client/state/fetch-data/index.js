export { fetchAction } from './actions';

// TODO: Make this into a class for cohesiveness and testing purposes.

// Global for fetch-data to track the active service/fetch subscriptions in the app.
const subscriptions = new Map();

/**
 * A collection of functions to be used with `shouldUpdate` on a `fetch` object.
 */
export const updateWhen = {
	notFetched: updateWhenNotFetched,
}

/**
 * Checks if fetch has been successfully fetched yet.
 *
 * @param timeout { number } The amount of time between fetch attempts (default 10 seconds)
 */
function updateWhenNotFetched( timeout = 10000 ) {
	return function updateWhenNotFetched_inner( fetch, fetchStatus ) {
		const fetched = fetchStatus.lastFetchTime && ! fetchStatus.errors;

		if ( fetched ) {
			return false;
		} else {
			const lastFetch = fetchStatus.lastFetchTime || 0;

			// Make sure to not rapidly ping the server.
			const timeoutReached = lastFetch + timeout < Date.now();

			return timeoutReached;
		}
	}
}

/**
 * Subscribes to a fetch.
 *
 * Note: This should be unsubscribed when the UI element no longer needs the
 * data from the fetch.
 *
 * @param fetch { Object } Fetch object for subscription.
 */
export function fetchSubscribe( fetch ) {
	const { service, key } = fetch;

	console.log( 'fetch-data: Subscribing to fetch ' + service + ':' + key );

	let serviceSubscriptions = subscriptions.get( service );
	if ( ! serviceSubscriptions ) {
		// Need to add this service to the list.
		serviceSubscriptions = new Map();
		subscriptions.set( service, serviceSubscriptions );
	}

	let keySubscriptions = serviceSubscriptions.get( key );
	if ( ! keySubscriptions ) {
		// Need to add this key to the list.
		keySubscriptions = new Set();
		serviceSubscriptions.set( key, keySubscriptions );
	}

	if ( keySubscriptions.has( fetch ) ) {
		throw new Error( 'Cannot subscribe. Fetch already subscribed.' );
	}

	keySubscriptions.add( fetch );

	return createFetchHandle( fetch );
}

/**
 * Unsubscribes from a fetch.
 *
 * Note: This should be done when a UI element no longer needs the data from
 * the fetch. This allows that data to be cleared out and garbage collected.
 *
 * @param fetch { Object } Fetch object for subscription.
 */
function fetchUnsubscribe( fetch ) {
	const { service, key } = fetch;

	console.log( 'fetch-data: Unsubscribing from fetch ' + service + ':' + key );

	const serviceSubscriptions = subscriptions.get( service ) || new Map();
	const keySubscriptions = serviceSubscriptions.get( key ) || new Set();

	if ( ! keySubscriptions.has( fetch ) ) {
		throw new Error( 'Cannot unsubscribe. Fetch not subscribed.' );
	}

	keySubscriptions.delete( fetch );

	if ( 0 === keySubscriptions.size ) {
		// No other fetches for this key, so remove the key.
		serviceSubscriptions.delete( key );

		if ( 0 === serviceSubscriptions.size ) {
			// No other keys for this service, so remove the service.
			subscriptions.delete( service );
		}
	}
}

/**
 * Creates selector function for current fetch value and status.
 *
 * @param fetch { Object } Fetch object for which to get the fetch state
 * @return { Object } An object with the following functions:
 *	value( state ): Takes redux state and returns current fetch value (or defaultValue if not available).
 *	status( state ): Takes redux state and returns current fetch status (error, etc.)
 *	unsubscribe(): Unsubscribes this fetch.
 */
function createFetchHandle( fetch ) {
	const getKeyNode = ( fetch, state ) => {
		const { fetchData } = state;
		const serviceNode = fetchData[ fetch.service ] || {};
		return serviceNode[ fetch.key ] || {};
	};

	return {
		value: ( state ) => {
			const keyNode = getKeyNode( fetch, state );
			return keyNode.value || fetch.defaultValue;
		},
		status: ( state ) => {
			const keyNode = getKeyNode( fetch, state );
			return keyNode.status || {};
		},
		unsubscribe: () => {
			fetchUnsubscribe( fetch );
		},
	};
}

