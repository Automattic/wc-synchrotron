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
	return function updateWhenNotFetched_inner( fetch, fetchState ) {
		const lastFetch = fetchState.lastFetchTime || 0;
		const lastError = fetchState.lastErrorTime || 0;
		const fetched = lastFetch > lastError;

		// Make sure to not rapidly ping the server.
		const timeoutReached = lastFetch + timeout < Date.now();

		return ! fetched && timeoutReached;
	}
}

/**
 * Gets fetch state from the redux store state.
 *
 * @param fetch { Object } Fetch object for which to get the fetch state
 * @param state { Object } Redux store state
 * @return { Object } fetch state node, contains { data, error, lastFetched, lastUsed }
 */
function getFetchState( fetch, state ) {
	const { fetchData } = state;
	const serviceData = fetchData[ fetch.service ] || {};
	const fetchState = serviceData && serviceData[ fetch.key ] || {};

	if ( fetchState.hasOwnProperty( 'data' ) ) {
		return fetchState;
	} else {
		return { ...fetchState, data: fetch.defaultValue };
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
				this.fetchProps = mapFetchProps( props );
				this.updateFetchPropsData();
			}

			clearCache() {
				this.fetchProps = {};
				this.fetchPropsState = {};
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
					const fetch = this.fetchProps[ name ];
					const propState = this.fetchPropsState[ name ];
					const fetchState = getFetchState( fetch, this.store.getState() );

					if ( propState !== fetchState ) {
						this.fetchPropsState[ name ] = fetchState;
						this.haveFetchPropsChanged = true;
					}

					if ( fetchUpdates && fetch.shouldUpdate( fetch, fetchState ) ) {
						this.store.dispatch( fetch.action( this.store.getState() ) );
					}
				}
			}

			render() {
				let combinedProps = { ...this.props, ...this.fetchPropsState };

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

