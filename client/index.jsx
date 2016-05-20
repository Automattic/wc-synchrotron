import 'calypso/boot';
import 'babel-core/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, useRouterHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import createHistory from 'history/lib/createHashHistory';
import configureStore from 'state';
import '../assets/stylesheets/style.scss';

// Screen components
import App from 'app';
import CouponsScreen from 'components/coupons/coupons-screen';
import TaxRatesScreenContainer from 'components/tax-rates/tax-rates-screen-container';

// This differs from the examples for react-router-redux but allows us to set a
// basename since we're inside WordPress.
const browserHistory = useRouterHistory( createHistory )({
	basename: '/'
});
const store          = configureStore();
const history        = syncHistoryWithStore( browserHistory, store );
const rootComponent  =
	<Provider store={ store }>
		<Router history={ history }>
			<Route path="/" component={ App }>
				<IndexRoute component={ Dashboard } />
				<Route path="coupons" component={ CouponsScreen }/>
				<Route path="taxes" component={ TaxRatesScreenContainer }/>
			</Route>
		</Router>
	</Provider>;

ReactDOM.render( rootComponent, document.getElementById( 'wc-synchrotron' ) );
