import { handleActions } from 'redux-actions';
import { TYPES } from './actions';

export const initialState = {
	isFetching: false,
	isFetched: false,
	error: null,
	coupons: [],
	editing: {},
};

export default handleActions( {
	[ TYPES.EDIT ]: couponsEdit,
	[ TYPES.CANCEL_EDIT ]: couponsCancelEdit,
	[ TYPES.FETCHING ]: couponsFetching,
	[ TYPES.FETCHED ]: couponsFetched,
	[ TYPES.SET_ERROR ]: couponsError,
}, initialState );

export function couponsEdit( state, action ) {
	const { fieldName, fieldValue } = action.payload;
	let { coupon } = action.payload;
	const key = coupon.id;

	if ( fieldName ) {
		coupon = Object.assign( {}, coupon, { [fieldName]: fieldValue } );
	}

	const editing = Object.assign( {}, state.editing, {
		[key]: coupon
	} );
	return Object.assign( {}, state, { editing } );
}

export function couponsCancelEdit( state, action ) {
	const coupon = action.payload;
	const remaining = {};

	for ( let key in state.editing ) {
		if ( key != coupon.id ) { // eslint-disable-line eqeqeq
			remaining[key] = state.editing[key];
		}
	}
	return Object.assign( {}, state, { editing: remaining } );
}

export function couponsFetching( state ) {
	return Object.assign( {}, state, {
		isFetching: true,
		isFetched: false,
		error: null,
	} );
}

export function couponsFetched( state, action ) {
	return Object.assign( {}, state, {
		isFetching: false,
		isFetched: true,
		error: null,
		coupons: action.payload,
	} );
}

export function couponsError( state, action ) {
	return Object.assign( {}, state, {
		isFetching: false,
		isFetched: false,
		error: action.payload,
	} );
}
