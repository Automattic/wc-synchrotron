import { expect } from 'chai';

import couponsReducer, {
	initialState,
	couponsEdit,
	couponsCancelEdit,
	couponsFetching,
	couponsFetched,
	couponsError,
} from '../reducer';

describe( 'reducer', () => {
	it( 'state should default to initialState', () => {
		const state = couponsReducer( undefined, {} );
		expect( state ).to.equal( initialState );
	} );

	// Utilize the same coupon constants for several tests,
	// since the reducer functions are pure anyway.
	const coupon1 = { id: 123, code: 'coupon1' };
	const coupon2 = { id: 345, code: 'coupon2' };

	describe( '#couponsEdit()', () => {
		it( 'should add coupon to editing list', () => {
			const stateIn = {
				coupons: [ coupon1, coupon2 ],
				editing: {},
			};
			const action = {
				payload: {
					coupon: coupon1,
					fieldName: 'code',
					fieldValue: 'cxx1',
				}
			};
			const stateOut = couponsEdit( stateIn, action );

			expect( stateOut.coupons ).to.equal( stateIn.coupons );
			expect( stateOut.editing ).to.deep.equal( {
				[ coupon1.id ]: { id: coupon1.id, code: 'cxx1' },
			} );
		} );
	} );

	describe( '#couponsCancelEdit()', () => {
		it( 'should remove coupon from editing list', () => {
			const stateIn = {
				coupons: [ coupon1, coupon2 ],
				editing: {
					[ coupon1.id ]: coupon1,
					[ coupon2.id ]: coupon2
				},
			};
			const action = {
				payload: coupon1,
			}
			const stateOut = couponsCancelEdit( stateIn, action );

			expect( stateOut.coupons ).to.equal( stateIn.coupons );
			expect( stateOut.editing ).to.deep.equal( {
				[ coupon2.id ]: coupon2,
			} );
		} );
	} );

	describe( '#couponsFetching()', () => {
		it( 'should set status fields and not touch coupons array', () => {
			const stateIn = {
				coupons: [ coupon1 ],
			};
			const stateOut = couponsFetching( stateIn, {} );

			expect( stateOut.isFetching ).to.be.true;
			expect( stateOut.isFetched ).to.be.false;
			expect( stateOut.error ).to.be.null;
			expect( stateOut.coupons ).to.equal( stateIn.coupons );
		} );
	} );

	describe( '#couponsFetched()', () => {
		it( 'should set status fields and coupons array', () => {
			const stateIn = {
				coupons: [ coupon1 ],
			};
			const action = {
				payload: [ coupon1, coupon2 ],
			};
			const stateOut = couponsFetched( stateIn, action );

			expect( stateOut.isFetching ).to.be.false;
			expect( stateOut.isFetched ).to.be.true;
			expect( stateOut.error ).to.be.null;
			expect( stateOut.coupons ).to.be.deep.equal( [ coupon1, coupon2 ] );
		} );
	} );

	describe( '#couponsError()', () => {
		it( 'should set status fields and not touch coupons array', () => {
			const stateIn = {
				coupons: [ coupon1 ],
			};
			const action = {
				payload: 'Test Error'
			};
			const stateOut = couponsError( stateIn, action );

			expect( stateOut.isFetching ).to.be.false;
			expect( stateOut.isFetched ).to.be.false;
			expect( stateOut.error ).to.equal( 'Test Error' );
			expect( stateOut.coupons ).to.equal( stateIn.coupons );
		} );
	} );
} );

