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
				this.fetchProps = {};
			}

			componentWillReceiveProps( nextProps ) {
				// Every time this component gets new props,
				// update the fetch props because they can depend on them.
				this.fetchProps = mapFetchProps( this.props );

				// Check if we should update our fetches.
				for ( name in this.fetchProps ) {
					const fetch = this.fetchProps[ name ];
					const data = this.getFetchData( fetch );

					if ( fetch.shouldUpdate( fetch, data ) ) {
						this.store.dispatch( fetch.action( this.store.getState() ) );
					}
				}
			}

			getFetchData( fetch ) {
				const { fetchData } = this.store.getState();
				const serviceData = fetchData[ fetch.service ];
				const data = serviceData && serviceData[ fetch.key ] || fetch.defaultValue;
				return data;
			}

			render() {
				let combinedProps = { ...this.props };

				// Overwrite anything in the existing props with what we have here.
				for ( name in this.fetchProps ) {
					const fetch = this.fetchProps[ name ];

					combinedProps[ name ] = this.getFetchData( fetch );
				}

				return createElement( WrappedComponent, combinedProps );
			}
		};

		FetchConnect.contextTypes = { store: PropTypes.object };
		FetchConnect.displayName = 'FetchConnect' + WrappedComponent.displayName;

		return FetchConnect;
	}
}

