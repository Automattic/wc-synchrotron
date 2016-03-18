import { createAction } from 'redux-actions';

export const ACTION_NAMES = {
	COUPONS_FETCH: 'COUPONS_FETCH'
};

export function fetchCoupons( ) {
	return createAction( ACTION_NAMES.COUPONS_FETCH )( {} );
}

