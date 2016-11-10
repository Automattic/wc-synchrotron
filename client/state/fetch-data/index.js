import { createElement, Component, PropTypes } from 'react';

export { dataFetched } from './actions';

/**
 * @summary Retrieves data from the fetch-data state store.
 *
 * This looks for the fetched data in memory and returns it if it exists.
 * Otherwise, returns null.
 *
 * @param { String } service Name of service to which the data belongs.
 * @param { String } key Describes uniquely what data was fetched.
 * @param { Object } The fetch data state as returned by the reducer.
 * @return { Any } The data if it exists in memory, otherwise null.
 */
export function getFetchData( service, key, defaultValue, state ) {
	const { fetchData } = state;
	const serviceData = fetchData[ service ];
	const data = ( serviceData ? serviceData[ key ] : defaultValue );
	return data;
}

export function fetchConnect( getFetchProps, mapStateToProps, mapDispatchToProps ) {

	return function wrapWithFetchConnect( WrappedComponent ) {

		let fetchProps = {};
		let fetchActions = {};
		let boundActions = {};

		class FetchConnect extends Component {
			constructor( props, context ) {
				super( props, context );
				this.store = props.store || context.store;
			}

			componentWillReceiveProps( nextProps ) {
			}

			render() {
				let state = this.store.getState();
				let fetchProps = getFetchProps( this.props );
				let combinedProps = { ...this.props };

				// Overwrite anything in the existing props with what we have here.
				for ( name in fetchProps ) {
					const prop = fetchProps[ name ];

					combinedProps[ name ] = prop.data( state );
				}

				return createElement( WrappedComponent, combinedProps );
			}
		};

		FetchConnect.contextTypes = { store: PropTypes.object };
		FetchConnect.displayName = 'FetchConnected' + WrappedComponent.displayName;

		return FetchConnect;
	}
}

