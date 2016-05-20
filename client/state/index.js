import { createStore, applyMiddleware, combineReducers } from 'redux';
import createLogger from 'redux-logger';
import multi from 'redux-multi';
import effects from 'redux-effects';
import fetch from 'redux-effects-fetch';
import { routerReducer } from 'react-router-redux';

import coupons from './coupons/reducer';
import taxRates from './tax-rates/reducer';

export const rootReducer = combineReducers( {
	coupons,
	taxRates,
	routing: routerReducer,
} );

const createStoreWithMiddleware = applyMiddleware(
	multi,
	effects,
	fetch,
	createLogger()
)( createStore );

export default function configureStore( initialState ) {
	const store = createStoreWithMiddleware( rootReducer, initialState );
	return store;
}
