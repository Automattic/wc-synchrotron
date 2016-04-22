import calypsoBoot from '../calypso/boot';
import 'babel-core/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import CouponsScreen from '../components/coupons/coupons-screen';
import '../../assets/stylesheets/style.scss';
import configureStore from '../state';
import screenData from '../utils/screen-data';

const data = screenData( 'wc_coupon_screen_data' );
const store = configureStore();

const rootComponent =
	<Provider store={ store }>
		<CouponsScreen data={ data } />
	</Provider>;

ReactDOM.render( rootComponent, document.getElementById( 'coupons_screen' ) );

