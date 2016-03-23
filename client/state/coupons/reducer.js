import { handleActions } from 'redux-actions';
import { ACTION_NAMES } from './actions';

export const initialState = {
	isFetching: false,
	isFetched: false,
	error: null,
	coupons: {}
};

export default handleActions( {
	[ ACTION_NAMES.COUPONS_FETCHING ]: couponsFetching,
	[ ACTION_NAMES.COUPONS_FETCHED ]: couponsFetched,
	[ ACTION_NAMES.COUPONS_SET_ERROR ]: couponsError
}, initialState );

function couponsFetching( state, action ) {
	return Object.assign( {}, state, {
		isFetching: true,
		isFetched: false,
		error: null,
	} );
}

function couponsFetched( state, action ) {
	return Object.assign( {}, state, {
		isFetching: false,
		isFetched: true,
		error: null,
		coupons: action.payload
	} );
}

function couponsError( state, action ) {
	return Object.assign( {}, state, {
		isFetching: false,
		isFetched: false,
		error: action.payload,
	} );
}

