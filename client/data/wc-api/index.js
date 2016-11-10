import { getConfig, setConfig } from '../../state/app-config';
import fetchData, { fetchAction } from '../../state/fetch-data';

const SERVICE = 'wc-api-redux';

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
	return {
		service: SERVICE,
		key: '/products/categories',
		defaultValue: [],
		shouldUpdate: fetchData.notPresent(),
		action: ( state ) => createRequestAction( '/products/categories', state ),
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
	return {
		service: SERVICE,
		key: '/taxes/classes',
		defaultValue: [],
		shouldUpdate: fetchData.notPresent(),
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

