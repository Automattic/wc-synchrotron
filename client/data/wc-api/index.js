import { getConfig, setConfig } from '../../state/app-config';
import { getFetchData } from '../../state/fetch-data';

// TODO: This is temporary, until the rest of the stuff gets moved over from here.
import { fetchProductCategories, fetchTaxClasses } from '../../wc-api-redux';

const SERVICE = 'wc-api-redux';

export function configureApi( apiRoot, nonce ) {
	return setConfig( SERVICE, {
		apiRoot,
		nonce
	} );
}

export function categories() {
	return {
		action: fetchProductCategories,
		data: ( state ) => {
			return getFetchData( SERVICE, '/products/categories', [], state );
		},
	};
}

export function taxClasses() {
	return {
		action: fetchTaxClasses,
		data: ( state ) => {
			return getFetchData( SERVICE, '/taxes/classes', [], state );
		},
	};
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

