import { createElement, Component } from 'react';
import { connect } from 'react-redux';

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

		const combinedMapStateToProps = ( state ) => {
			const props = { ...mapStateToProps( state ) };

			// Overwrite anything in the existing props with what we have here.
			for ( name in fetchProps ) {
				props[ name ] = fetchProps[ name ].data( state );
			}
			console.log( 'fetch props' );
			console.log( fetchProps );
			console.log( 'combined props' );
			console.log( props );
			return props;
		}


		class FetchConnect extends Component {
			componentWillReceiveProps( nextProps ) {
				fetchProps = getFetchProps( nextProps );
			}

			render() {
				const element = createElement( WrappedComponent, this.props );
				return element;
			}
		};

		FetchConnect.displayName = 'FetchConnected' + WrappedComponent.displayName;

		return connect( combinedMapStateToProps, mapDispatchToProps )( FetchConnect );
	}
}

