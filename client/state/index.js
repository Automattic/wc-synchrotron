import { createStore, applyMiddleware, combineReducers } from 'redux';
import createLogger from 'redux-logger';

import coupons from './coupons/reducer';

export const rootReducer = combineReducers( {
	coupons
} );

const createStoreWithMiddleware = applyMiddleware(
	createLogger()
)( createStore );

export default function configureStore( initialState ) {
	const store = createStoreWithMiddleware( rootReducer, initialState );

	return store;
}

