import { getConfig, setConfig } from '../../state/app-config';
import { fetchAction } from '../../state/fetch-data/actions';

const SERVICE = 'wc-api-redux';

export function configureApi( apiRoot, nonce ) {
	return setConfig( SERVICE, {
		apiRoot,
		nonce
	} );
}

// TODO: Add parameters to filter?
export function fetchCategories() {
	return {
		service: SERVICE,
		key: '/products/categories',
		defaultValue: [],
		action: ( state ) => createRequestAction( '/products/categories', state ),
	};
}

// TODO: Add parameters to filter?
export function fetchTaxClasses() {
	return {
		service: SERVICE,
		key: '/taxes/classes',
		defaultValue: [],
		action: ( state ) => createRequestAction( '/taxes/classes', state ),
	};
}

function createRequestAction( endpointUrl, state ) {
	const config = getConfig( state )( SERVICE );
	const url = config.apiRoot + endpointUrl;
	const headers = new Headers();

	headers.set( 'x-wp-nonce', config.nonce );

	const params = {
		method: 'GET',
		credentials: 'same-origin',
		headers,
	};

	return fetchAction( SERVICE, endpointUrl, url, params );
}

