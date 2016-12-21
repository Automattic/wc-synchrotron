import { expect } from 'chai';
import FetchExpiration from '../fetch-expiration';
import { deleteFetch } from '../actions';

describe( 'expiration', () => {
	describe( '#FetchExpiration()', () => {
		describe( '#fetchRequested()', () => {
			const fetchNoExpire = { service: 'myService', key: 'myKey' };
			const fetchExpire20 = { service: 'myService', key: 'myKey', expirationMinutes: 20 };
			const fetchExpire10 = { service: 'myService', key: 'myKey', expirationMinutes: 10 };
			const earlier = new Date( 2016, 12, 20, 17, 2, 35 );
			const now = new Date( 2016, 12, 20, 17, 13, 20 );

			it ( 'should store lastUsed timestamp', () => {
				const expiration = new FetchExpiration( () => {} );

				expiration.fetchRequested( fetchNoExpire, now );

				expect( expiration.getFetchMeta( 'myService', 'myKey', 'lastUsed' ) ).to.equal( now );
				expect( expiration.getFetchMeta( 'myService', 'myKey', 'expirationMinutes' ) ).to.not.exist;
			} );

			it ( 'should overwrite lastUsed in subsequent calls', () => {
				const expiration = new FetchExpiration( () => {} );

				expiration.fetchRequested( fetchNoExpire, earlier );
				expiration.fetchRequested( fetchNoExpire, now );

				expect( expiration.getFetchMeta( 'myService', 'myKey', 'lastUsed' ) ).to.equal( now );
			} );

			it ( 'should overwrite expiration when not present before', () => {
				const expiration = new FetchExpiration( () => {} );

				expiration.fetchRequested( fetchNoExpire, now );
				expiration.fetchRequested( fetchExpire20, now );

				expect( expiration.getFetchMeta( 'myService', 'myKey', 'expirationMinutes' ) ).to.equal( 20 );
			} );

			it ( 'should overwrite expiration when a longer expiration is specified', () => {
				const expiration = new FetchExpiration( () => {} );

				expiration.fetchRequested( fetchExpire10, now );
				expiration.fetchRequested( fetchExpire20, now );

				expect( expiration.getFetchMeta( 'myService', 'myKey', 'expirationMinutes' ) ).to.equal( 20 );
			} );

			it ( 'upon expiration, should clear meta and dispatch action to clear stored data', () => {
				const actions = [];
				const mockDispatch = ( action ) => { actions.push( action ); }
				const expiration = new FetchExpiration( mockDispatch );

				expiration.fetchRequested( fetchExpire10, earlier );
				expiration.cleanExpired( mockDispatch, now );

				expect( expiration.getFetchMeta( 'myService', 'myKey', 'lastUsed' ) ).to.not.exist;
				expect( expiration.getFetchMeta( 'myService', 'myKey', 'expirationMinutes' ) ).to.not.exist;
				expect( actions[0] ).to.eql( deleteFetch( 'myService', 'myKey' ) );
			} );
		} );
	} );
} );

