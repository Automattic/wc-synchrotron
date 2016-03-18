import { handleActions } from 'redux-actions';
import { ACTION_NAMES } from './actions';

export const initialState = {
};

export default handleActions( {
	[ ACTION_NAMES.COUPONS_FETCH ]: couponFetchRequested
}, initialState );

function couponFetchRequested( state, action ) {
	console.log( 'coupon fetch requested' );
	return state;
}

