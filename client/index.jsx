import "babel-polyfill";
import 'calypso/boot';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, useRouterHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import createHistory from 'history/lib/createHashHistory';
import configureStore from 'state';
import '../assets/stylesheets/style.scss';
import { routes } from './routes';
import AdminNotices from './admin-notices';
import screenData from './utils/screen-data';
import { initialize as initializeApi } from './wc-api-redux';
import { configureApi } from './data/wc-api';

const data = screenData( 'wc_synchrotron_data' );

// This differs from the examples for react-router-redux but allows us to set a
// basename since we're inside WordPress.
const browserHistory = useRouterHistory( createHistory )({
	basename: '/'
});
const store          = configureStore();
const history        = syncHistoryWithStore( browserHistory, store );

// Initialize the WooCommerce Redux Middleware
// TODO: Remove this after fetch-data is fully implemented.
store.dispatch( initializeApi( data.api_root, data.nonce ) );

// Configure the WooCommerce API
store.dispatch( configureApi( data.api_root, data.nonce ) );

const rootComponent  =
	<Provider store={ store }>
		<Router history={ history }>{ routes }</Router>
	</Provider>;

ReactDOM.render( <AdminNotices />, document.getElementById( 'wc-admin-notices' ) );

ReactDOM.render( rootComponent, document.getElementById( 'wc-synchrotron' ) );
