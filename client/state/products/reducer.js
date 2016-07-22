import { handleActions } from 'redux-actions';
import { TYPES } from './actions';

export const initialState = {
	isFetching: false,
	isFetched: false,
	error: null,
	products: [],
	editing: {},
	display: {
		showColumnPanel: false
	}
};

export default handleActions( {
	[ TYPES.FETCHING ]: productsFetching,
	[ TYPES.FETCHED ]: productsFetched,
	[ TYPES.SET_DISPLAY_OPTION ]: productsSetDisplayOption,
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

export function productsSetDisplayOption( state, action ) {
	const { option, value } = action.payload;
	const display = Object.assign( {}, state.display, { [option]: value } );

	return Object.assign( {}, state, {
		display
	} );
}

export function productsError( state, action ) {
	return Object.assign( {}, state, {
		isFetching: false,
		isFetched: false,
		error: action.payload,
	} );
}

