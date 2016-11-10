import { getConfig, setConfig } from '../../state/app-config';
import fetchData, { fetchAction } from '../../state/fetch-data';

const SERVICE = 'wc-api-redux';

/**
 * Configures the WooCommerce API for requests.
 *
 * This sets the root URL of the API and the
 * nonce for authentication. It adds this data to the
 * redux state for later retrieval.
 *
 * @param apiRoot { string } Base URL to use for the API.
 * @param nonce { string } The current API nonce to use for authentication.
 */
export function configureApi( apiRoot, nonce ) {
	return setConfig( SERVICE, {
		apiRoot,
		nonce
	} );
}

/**
 * Fetches all product categories.
 *
 * @see http://woocommerce.github.io/woocommerce-rest-api-docs/#list-all-product-categories
 * @return { function } A fetch object for product categories.
 *
 * TODO: Add parameters to filter?
 */
export function fetchCategories() {
	const url = '/products/categories';

	return {
		service: SERVICE,
		key: url,
		defaultValue: [],
		shouldUpdate: fetchData.notPresent(),
		action: ( state ) => createRequestAction( url, state ),
	};
}


/**
 * Fetches all tax classes.
 *
 * @see http://woocommerce.github.io/woocommerce-rest-api-docs/#tax-classes
 * @return { function } A fetch object for tax classes.
 *
 * TODO: Add parameters to filter?
 */
export function fetchTaxClasses() {
	const url = '/taxes/classes';

	return {
		service: SERVICE,
		key: url,
		defaultValue: [],
		shouldUpdate: fetchData.notPresent(),
		action: ( state ) => createRequestAction( url, state ),
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

