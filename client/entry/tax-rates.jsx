import '../calypso/boot';
import 'babel-core/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import TaxRatesScreenContainer from '../components/tax-rates/tax-rates-screen-container';
import '../../assets/stylesheets/style.scss';
import configureStore from '../state';

const data  = wc_tax_rates_screen_data;
const store = configureStore();

const rootComponent =
	<Provider store={ store }>
        <TaxRatesScreenContainer data={ data } />
	</Provider>;

ReactDOM.render( rootComponent, document.getElementById( 'tax_rates_screen' ) );
