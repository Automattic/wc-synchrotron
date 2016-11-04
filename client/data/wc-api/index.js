import { getConfig, setConfig } from '../../state/app-config';
import { getFetchData } from '../../state/fetch-data';

const SERVICE = 'wc-api-redux';

export function getApiData( state ) {
	return {
		categories: () => {
			return getFetchData( SERVICE, '/products/categories', [], state );
		},
		taxClasses: () => {
			return getFetchData( SERVICE, '/taxes/classes', [], state );
		},
	}
}

function getEndpoint( endpointUrl, updateFrequency, config, reduxState ) {

	const url = config.baseUrl + endpointUrl;
	const method = 'GET';
	const credentials = 'same-origin';
	const headers = new Headers();

	headers.set( 'x-wp-nonce', config.nonce );

	const params = { method, credentials, headers };

	return getFetchData( url, params, updateFrequency, reduxState );
}

