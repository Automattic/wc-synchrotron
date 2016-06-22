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

// This differs from the examples for react-router-redux but allows us to set a
// basename since we're inside WordPress.
const browserHistory = useRouterHistory( createHistory )({
	basename: '/'
});
const store          = configureStore();
const history        = syncHistoryWithStore( browserHistory, store );
const rootComponent  =
	<Provider store={ store }>
		<Router history={ history }>{ routes }</Router>
	</Provider>;

ReactDOM.render( rootComponent, document.getElementById( 'wc-synchrotron' ) );
