import { createElement, Component, PropTypes } from 'react';
import FetchExpiration from './fetch-expiration';

export { fetchAction } from './actions';

// Global fetch expiration data.
let fetchExpiration = null;

/**
 * Initializes fetch-data with the ability to dispatch actions.
 */
export function initialize( dispatch, windowTimers ) {
	fetchExpiration = new FetchExpiration( dispatch, windowTimers );
}

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
 * Creates selector function for fetch data.
 *
 * @param fetch { Object } Fetch object for which to get the fetch state
 * @return { function } A fetch selector that takes the current redux state and
 *                      returns the fetch data, or fetch.defaultValue if not available.
 */
export function selectFetchData( fetch ) {
	return ( state ) => {
		fetchExpiration.fetchRequested( fetch );

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
export function selectFetchStatus( fetch ) {
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
				this.clearCache();
				this.updateFetchProps( props );
				this.updateFetchPropsData();

				this.getFetchStatus = this.getFetchStatus.bind( this );
			}

			clearCache() {
				this.fetchProps = {};
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
				this.haveOwnPropsChanged = true;

				// Every time this component gets new props,
				// update the fetch props because they can depend on them.
				this.updateFetchProps( nextProps );
				this.updateFetchPropsData( true );
			}

			componentWillUnmount() {
				if ( this.unsubscribe ) {
					this.unsubscribe();
					this.unsubscribe = null;
				}
				this.clearCache();
			}

			handleChange() {
				this.updateFetchPropsData();
			}

			updateFetchProps( props ) {
				this.fetchProps = mapFetchProps( props );

				for ( let name in this.fetchProps ) {
					const fetch = this.fetchProps[ name ];

					this.fetchDataSelectors[ name ] = selectFetchData( fetch );
					this.fetchStatusSelectors[ name ] = selectFetchStatus( fetch );
				}
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

