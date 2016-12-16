import { createElement, Component, PropTypes } from 'react';

export { fetchAction } from './actions';

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
 * Gets fetch state from the redux store state.
 *
 * @param fetch { Object } Fetch object for which to get the fetch state
 * @param state { Object } Redux store state
 * @return { Object } fetched data, or fetch.defaultValue if not available.
 */
function getFetchData( fetch, state ) {
	const { fetchData } = state;
	const serviceData = fetchData[ fetch.service ] || {};

	if ( serviceData.hasOwnProperty( fetch.key ) ) {
		return serviceData[ fetch.key ];
	} else {
		return fetch.defaultValue;
	}
}

/**
 * Gets status metadata for given fetch, from the redux store.
 *
 * @param fetch { Object } Fetch object for which to get the status
 * @param state { Object } Redux store state
 * @return { Object } fetch status object `{ lastFetchTime, lastSuccessTime, errors }`
 */
function getFetchStatus( fetch, state ) {
	const { fetchData } = state;
	const serviceStatus = fetchData[ fetch.service + '_status' ] || {};

	return serviceStatus[ fetch.key ] || {};
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
				this.fetchProps = mapFetchProps( props );
				this.updateFetchPropsData();
			}

			clearCache() {
				this.fetchProps = {};
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
				this.fetchProps = mapFetchProps( nextProps );
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

			updateFetchPropsData( fetchUpdates = false ) {
				for ( let name in this.fetchProps ) {
					const reduxState = this.store.getState();
					const fetch = this.fetchProps[ name ];
					const propData = this.fetchPropsData[ name ];
					const fetchData = getFetchData( fetch, reduxState );
					const fetchStatus = getFetchStatus( fetch, reduxState );

					if ( propData !== fetchData ) {
						this.fetchPropsData[ name ] = fetchData;
						this.haveFetchPropsChanged = true;
					}

					if ( fetchUpdates && fetch.shouldUpdate( fetch, fetchStatus ) ) {
						this.store.dispatch( fetch.action( this.store.getState() ) );
					}
				}
			}

			render() {
				let combinedProps = { ...this.props, ...this.fetchPropsData };

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

