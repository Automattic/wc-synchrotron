import { createElement, Component, PropTypes } from 'react';

export { dataFetched } from './actions';

function getFetchData( fetch, state ) {
	const { fetchData } = state;
	const serviceData = fetchData[ fetch.service ];
	const data = serviceData && serviceData[ fetch.key ] || fetch.defaultValue;
	return data;
}

export function fetchConnect( mapFetchProps, mapStateToProps, mapDispatchToProps ) {

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
				let fetchProps = mapFetchProps( this.props );
				let combinedProps = { ...this.props };

				// Overwrite anything in the existing props with what we have here.
				for ( name in fetchProps ) {
					const fetch = fetchProps[ name ];

					combinedProps[ name ] = getFetchData( fetch, state );
				}

				return createElement( WrappedComponent, combinedProps );
			}
		};

		FetchConnect.contextTypes = { store: PropTypes.object };
		FetchConnect.displayName = 'FetchConnect' + WrappedComponent.displayName;

		return FetchConnect;
	}
}

