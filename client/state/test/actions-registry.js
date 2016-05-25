import { expect } from 'chai';

import { registerActionTypes } from '../actions-registry';

describe( 'actions-registry', () => {
	describe( 'registerActionTypes', () => {
		it ( 'returns types and actions', () => {
			const registry = {};
			const { types, actions } = registerActionTypes( 'PREFIX', [
				'ONE',
				'TWO',
			], registry );

			expect( types ).to.exist;
			expect( types.ONE ).to.equal( 'PREFIX_ONE' );
			expect( types.TWO ).to.equal( 'PREFIX_TWO' );

			expect( actions ).to.exist;
			expect( actions.ONE ).to.exist;
			expect( actions.ONE( 'payload_value' ) ).to.have.property( 'type', 'PREFIX_ONE' );
			expect( actions.ONE( 'payload_value' ) ).to.have.property( 'payload', 'payload_value' );
			expect( actions.TWO ).to.exist;
			expect( actions.TWO() ).to.have.property( 'type', 'PREFIX_TWO' );
		} );

		it ( 'allows registration of a prefix only once', () => {
			const registry = {};

			const registerOnce = () => {
				registerActionTypes( 'PREFIX', [ 'ONE' ], registry );
			}

			const registerAgain = () => {
				registerActionTypes( 'PREFIX', [ 'TWO' ], registry );
			}

			expect( registerOnce ).to.not.throw( Error );
			expect( registerAgain ).to.throw( Error, /already exists/ );
			expect( registry.PREFIX ).to.exist;
			expect( registry.PREFIX.types.ONE ).to.equal( 'PREFIX_ONE' );
		} );
	} );
} );

