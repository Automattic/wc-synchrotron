import { handleActions } from 'redux-actions';
import { TYPES } from './actions';

export const initialState = {
	isFetching: false,
	isFetched: false,
	error: null,
	products: [],
	editing: {},
};

export default handleActions( {
	[ TYPES.FETCHING ]: productsFetching,
	[ TYPES.FETCHED ]: productsFetched,
	[ TYPES.SET_ERROR ]: productsError,
}, initialState );

export function productsFetching( state ) {
	return Object.assign( {}, state, {
		isFetching: true,
		isFetched: false,
		error: null,
	} );
}

export function productsFetched( state, action ) {
	return Object.assign( {}, state, {
		isFetching: false,
		isFetched: true,
		error: null,
		products: action.payload,
	} );
}

export function productsError( state, action ) {
	return Object.assign( {}, state, {
		isFetching: false,
		isFetched: false,
		error: action.payload,
	} );
}

