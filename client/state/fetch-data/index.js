import debug from 'debug';

export { fetchAction } from './actions';

const log = debug( 'synchrotron:fetch-data' );

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

export class FetchData {
	constructor() {
		this.subscriptions = new Map();
	}

	/**
	 * Subscribes to a fetch.
	 *
	 * Note: This should be unsubscribed when the UI element no longer needs the
	 * data from the fetch.
	 *
	 * @param fetch { Object } Fetch object for subscription.
	 */
	subscribe( fetch ) {
		const { service, key } = fetch;

		log( 'fetch-data: Subscribing to fetch ' + service + ':' + key );

		let serviceSubscriptions = this.subscriptions.get( service );
		if ( ! serviceSubscriptions ) {
			// Need to add this service to the list.
			serviceSubscriptions = new Map();
			this.subscriptions.set( service, serviceSubscriptions );
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

		return this.createFetchHandle( fetch );
	}

	/**
	 * Unsubscribes from a fetch.
	 *
	 * Note: This should be done when a UI element no longer needs the data from
	 * the fetch. This allows that data to be cleared out and garbage collected.
	 *
	 * @param fetch { Object } Fetch object for subscription.
	 */
	unsubscribe( fetch ) {
		const { service, key } = fetch;

		log( 'fetch-data: Unsubscribing from fetch ' + service + ':' + key );

		const serviceSubscriptions = this.subscriptions.get( service ) || new Map();
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
				this.subscriptions.delete( service );
			}
		}
	}

	/**
	 * Gets a state key node from the redux state.
	 *
	 * @param fetch { Object } The fetch for the service/key.
	 * @param state { Object } The entire redux state.
	 */
	getStateKeyNode( fetch, state ) {
		const { fetchData } = state;
		const serviceNode = fetchData[ fetch.service ] || {};
		return serviceNode[ fetch.key ] || {};
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
	createFetchHandle( fetch ) {
		return {
			value: ( state ) => {
				const keyNode = this.getStateKeyNode( fetch, state );
				return keyNode.value || fetch.defaultValue;
			},
			status: ( state ) => {
				const keyNode = this.getStateKeyNode( fetch, state );
				return keyNode.status || {};
			},
			unsubscribe: () => {
				this.unsubscribe( fetch );
			},
		};
	}
}

const fetchDataInstance = new FetchData();

/**
 * Subscribes to a fetch.
 *
 * Note: This should be unsubscribed when the UI element no longer needs the
 * data from the fetch.
 *
 * @param fetch { Object } Fetch object for subscription.
 */
export function fetchSubscribe( fetch ) {
	return fetchDataInstance.subscribe( fetch );
}

