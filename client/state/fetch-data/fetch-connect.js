import { createElement, Component, PropTypes } from 'react';
import { fetchSubscribe } from './';

/**
 * Higher Order Component to map `fetch` objects to props.
 *
 * @param mapFetchProps { function( props ) } Returns a mapping object where keys are the prop names, and values are `fetch` objects.
 * @return { function( WrappedComponent ) } A function that wraps an existing React component with this mapping.
 */
export default function fetchConnect( mapFetchProps ) {

	return function wrapWithFetchConnect( WrappedComponent ) {

		class FetchConnect extends Component {
			constructor( props, context ) {
				super( props, context );
				this.store = props.store || context.store;
				this.fetchProps = {};

				this.clearCache();
				this.updateFetchProps( mapFetchProps( props ) );
				this.updateFetchPropsData();

				this.getFetchStatus = this.getFetchStatus.bind( this );
			}

			clearCache() {
				this.fetchHandles = {};
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
				this.updateFetchProps( mapFetchProps( nextProps ) );
				this.updateFetchPropsData( true );
			}

			componentWillUnmount() {
				if ( this.unsubscribe ) {
					this.unsubscribe();
					this.unsubscribe = null;
				}
				this.updateFetchProps( {} );
				this.clearCache();
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
						this.fetchHandles[ name ].unsubscribe();
					}
				}

				// Subscribe to any fetches that weren't in the old list.
				for ( let name in newFetchProps ) {
					const newFetch = newFetchProps[ name ];

					if ( newFetch !== oldFetchProps[ name ] ) {
						this.fetchHandles[ name ] = fetchSubscribe( newFetchProps[ name ] );
					}
				}

				this.fetchProps = newFetchProps;
			}

			updateFetchPropsData( fetchUpdates = false ) {
				for ( let name in this.fetchProps ) {
					const reduxState = this.store.getState();
					const fetch = this.fetchProps[ name ];
					const propData = this.fetchPropsData[ name ];
					const selectors = this.fetchHandles[ name ];
					const fetchData = selectors.value( reduxState );
					const fetchStatus = selectors.status( reduxState );

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

				return this.fetchHandles[ propName ].status( reduxState );
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

