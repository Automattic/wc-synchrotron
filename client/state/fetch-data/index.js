import { createElement, Component, PropTypes } from 'react';

export { fetchAction } from './actions';

/**
 * A collection of functions to be used with `shouldUpdate` on a `fetch` object.
 */
export const updateWhen = {
	notPresent: () => {
		return function fetchDataNotPresent( fetch, data ) {
			return data === fetch.defaultValue;
		}
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
					const fetch = this.fetchProps[ name ];
					const data = this.fetchPropsData[ name ];
					const storeData = this.getStoreData( fetch );

					if ( data !== storeData ) {
						this.fetchPropsData[ name ] = storeData;
						this.haveFetchPropsChanged = true;
					}

					if ( fetchUpdates && fetch.shouldUpdate( fetch, storeData ) ) {
						this.store.dispatch( fetch.action( this.store.getState() ) );
					}
				}
			}

			getStoreData( fetch ) {
				const { fetchData } = this.store.getState();
				const serviceData = fetchData[ fetch.service ];
				const data = serviceData && serviceData[ fetch.key ] || fetch.defaultValue;
				return data;
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

