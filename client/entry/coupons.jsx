import 'babel-core/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import CouponsScreen from '../components/coupons_screen';
import configureStore from '../state';

const store = configureStore();

const rootComponent =
	<Provider store={ store }>
		<CouponsScreen />
	</Provider>;

ReactDOM.render( rootComponent, document.getElementById( 'coupons_screen' ) );

