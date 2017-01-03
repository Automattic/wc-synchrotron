import { createElement, Component, PropTypes } from 'react';

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
}

/**
 * Unsubscribes from a fetch.
 *
 * Note: This should be done when a UI element no longer needs the data from
 * the fetch. This allows that data to be cleared out and garbage collected.
 *
 * @param fetch { Object } Fetch object for subscription.
 */
export function fetchUnsubscribe( fetch ) {
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
 * Creates selector function for fetch data.
 *
 * @param fetch { Object } Fetch object for which to get the fetch state
 * @return { function } A fetch selector that takes the current redux state and
 *                      returns the fetch data, or fetch.defaultValue if not available.
 */
function selectFetchData( fetch ) {
	return ( state ) => {
		const { fetchData } = state;
		const serviceNode = fetchData[ fetch.service ] || {};
		const keyNode = serviceNode[ fetch.key ] || {};
		const value = keyNode.value || fetch.defaultValue;

		return value;
	}
}

/**
 * Creates selector function for fetch status.
 *
 * @param fetch { Object } Fetch object for which to get the status
 * @return { function } A fetch selector that takes the current redux state and
 *                      returns the fetch status object:
 *                      `{ lastFetchTime, lastSuccessTime, errors }`
 */
function selectFetchStatus( fetch ) {
	return ( state ) => {
		const { fetchData } = state;
		const serviceNode = fetchData[ fetch.service ] || {};
		const keyNode = serviceNode[ fetch.key ] || {};
		const status = keyNode.status || {};

		return status;
	}
}

/**
 * Higher Order Component to map `fetch` objects to props.
 *
 * @param mapFetchProps { function( props ) } Returns a mapping object where keys are the prop names, and values are `fetch` objects.
 * @return { function( WrappedComponent ) } A function that wraps an existing React component with this mapping.
 */
export function fetchConnect( mapFetchProps ) {

	return function wrapWithFetchConnect( WrappedComponent ) {

		class FetchConnect extends Component {
			constructor( props, context ) {
				super( props, context );
				this.store = props.store || context.store;
				this.fetchProps = {};

				this.clearCache();
				console.log( 'FetchConnect.constructor() - after clearCache()' );
				this.updateFetchProps( mapFetchProps( props ) );
				this.updateFetchPropsData();

				this.getFetchStatus = this.getFetchStatus.bind( this );
			}

			clearCache() {
				console.log( 'FetchConnect.clearCache()' );
				this.fetchDataSelectors = {};
				this.fetchStatusSelectors = {};

				this.fetchPropsData = {};

				this.haveOwnPropsChanged = true;
				this.haveFetchPropsChanged = true;
			}

			shouldComponentUpdate() {
				return this.haveOwnPropsChanged || this.haveFetchPropsChanged;
			}

			componentDidMount() {
				this.unsubscribe = this.store.subscribe( this.handleChange.bind( this ) );
				this.updateFetchPropsData( true );
			}

			componentWillReceiveProps( nextProps ) {
				console.log( 'FetchConnect.componentWillRecieveProps()' );
				this.haveOwnPropsChanged = true;

				// Every time this component gets new props,
				// update the fetch props because they can depend on them.
				this.updateFetchProps( mapFetchProps( nextProps ) );
				this.updateFetchPropsData( true );
			}

			componentWillUnmount() {
				console.log( 'componentWillUnmount()' );
				if ( this.unsubscribe ) {
					this.unsubscribe();
					this.unsubscribe = null;
				}
				this.clearCache();
				this.updateFetchProps( {} );
			}

			handleChange() {
				this.updateFetchPropsData();
			}

			updateFetchProps( newFetchProps ) {
				const oldFetchProps = this.fetchProps;

				// Unsubscribe from any fetches that aren't in the new list.
				for ( let name in oldFetchProps ) {
					const oldFetch = oldFetchProps[ name ];

					if ( oldFetch !== newFetchProps[ name ] ) {
						fetchUnsubscribe( oldFetchProps[ name ] );
						console.log( 'oldFetch: ' + oldFetchProps[ name ] );
						console.log( 'newFetch: ' + newFetchProps[ name ] );
					}
				}

				// Subscribe to any fetches that weren't in the old list.
				for ( let name in newFetchProps ) {
					const newFetch = newFetchProps[ name ];

					if ( newFetch !== oldFetchProps[ name ] ) {
						fetchSubscribe( newFetchProps[ name ] );
						console.log( 'oldFetch: ' + oldFetchProps[ name ] );
						console.log( 'newFetch: ' + newFetchProps[ name ] );
					}

					this.fetchDataSelectors[ name ] = selectFetchData( newFetch );
					this.fetchStatusSelectors[ name ] = selectFetchStatus( newFetch );
				}

				this.fetchProps = newFetchProps;
			}

			updateFetchPropsData( fetchUpdates = false ) {
				for ( let name in this.fetchProps ) {
					const reduxState = this.store.getState();
					const fetch = this.fetchProps[ name ];
					const propData = this.fetchPropsData[ name ];
					const fetchData = this.fetchDataSelectors[ name ]( reduxState );
					const fetchStatus = this.fetchStatusSelectors[ name ]( reduxState );

					if ( propData !== fetchData ) {
						this.fetchPropsData[ name ] = fetchData;
						this.haveFetchPropsChanged = true;
					}

					if ( fetchUpdates && fetch.shouldUpdate( fetch, fetchStatus ) ) {
						this.store.dispatch( fetch.action( this.store.getState() ) );
					}
				}
			}

			/**
			 * Convenience function that will look up the status for a given fetch.
			 * @param propName The given property name for a mapped fetch.
			 * @return The current status of the fetch in the form of `{ lastFetchTime, lastSuccessTime, errors }`
			 */
			getFetchStatus( propName ) {
				const reduxState = this.store.getState();

				return this.fetchStatusSelectors[ propName ]( reduxState );
			}

			render() {
				let combinedProps = { ...this.props, ...this.fetchPropsData, getFetchStatus: this.getFetchStatus };

				this.haveOwnPropsChanged = false;
				this.haveFetchPropsChanged = false;

				return createElement( WrappedComponent, combinedProps );
			}
		};

		FetchConnect.contextTypes = { store: PropTypes.object };
		FetchConnect.displayName = 'FetchConnect' + WrappedComponent.displayName;

		return FetchConnect;
	}
}

