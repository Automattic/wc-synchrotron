import { expect } from 'chai';

import configureStore from '../';

describe( 'index', () => {
	describe( 'configureStore', () => {
		it( 'creates its own initialState', () => {
			const store = configureStore();
			const state = store.getState();

			expect( state ).to.exist;
			expect( state.coupons ).to.exist;
		} );
	} );
} );

