import { expect } from 'chai';
import FetchExpiration from '../fetch-expiration';
import { deleteFetch } from '../actions';

describe( 'expiration', () => {
	describe( '#FetchExpiration()', () => {
		const fetchNoExpire = { service: 'myService', key: 'myKey' };
		const fetchExpire20 = { service: 'myService', key: 'myKey', expirationMinutes: 20 };
		const fetchExpire10 = { service: 'myService', key: 'myKey', expirationMinutes: 10 };

		const fetch2NoExpire = { service: 'myService', key: 'myKey2' };
		const fetch2Expire15 = { service: 'myService', key: 'myKey2', expirationMinutes: 15 };

		const earlier = new Date( 2016, 11, 20, 17, 2, 35 );
		const now = new Date( 2016, 11, 20, 17, 13, 20 );
		const nowPlus10 = new Date( 2016, 11, 20, 17, 23, 20 );
		const nowPlus15 = new Date( 2016, 11, 20, 17, 28, 20 );
		const nowPlus20 = new Date( 2016, 11, 20, 17, 33, 20 );

		describe( '#getFetchExpiration', () => {
			it ( 'should return null if no expiration is set.', () => {
				const expiration = new FetchExpiration( () => {} );

				expiration.fetchRequested( fetchNoExpire, now );
				const fetchExpiration = expiration.getFetchExpiration( expiration.meta[ 'myService' ][ 'myKey' ] );

				expect( fetchExpiration ).to.not.exist;
			} );

			it ( 'should be valid if expiration is set.', () => {
				const expiration = new FetchExpiration( () => {} );

				expiration.fetchRequested( fetchExpire20, now );
				const fetchExpiration = expiration.getFetchExpiration( expiration.meta[ 'myService' ][ 'myKey' ] );

				expect( fetchExpiration ).to.eql( nowPlus20 );
			} );
		} );
		describe( '#findNextExpiration', () => {
			it ( 'should return null if no expirations are set.', () => {
				const expiration = new FetchExpiration( () => {} );

				expiration.fetchRequested( fetchNoExpire, now );
				expiration.fetchRequested( fetch2NoExpire, now );

				const nextExpiration = expiration.findNextExpiration();
				expect( nextExpiration ).to.not.exist;
			} );

			it ( 'should return nearest expiration of all fetches.', () => {
				const expiration = new FetchExpiration( () => {} );

				expiration.fetchRequested( fetchNoExpire, now );
				expiration.fetchRequested( fetch2Expire15, now );

				expect( expiration.findNextExpiration() ).to.eql( nowPlus15 );

				expiration.fetchRequested( fetchExpire10, now );

				expect( expiration.findNextExpiration() ).to.eql( nowPlus10 );
			} );
		} );
		describe( '#fetchRequested()', () => {
			it ( 'should store lastUsed timestamp', () => {
				const expiration = new FetchExpiration( () => {} );

				expiration.fetchRequested( fetchNoExpire, now );

				expect( expiration.getFetchMeta( 'myService', 'myKey', 'lastUsed' ) ).to.eql( now );
				expect( expiration.getFetchMeta( 'myService', 'myKey', 'expirationMinutes' ) ).to.not.exist;
			} );

			it ( 'should overwrite lastUsed in subsequent calls', () => {
				const expiration = new FetchExpiration( () => {} );

				expiration.fetchRequested( fetchNoExpire, earlier );
				expiration.fetchRequested( fetchNoExpire, now );

				expect( expiration.getFetchMeta( 'myService', 'myKey', 'lastUsed' ) ).to.eql( now );
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

			it ( 'should automatically update nextCleanup when a fetch with shorter expiration is added.', () => {
				const expiration = new FetchExpiration( () => {} );

				expiration.fetchRequested( fetchExpire20, now );
				const nextCleanup1 = expiration.nextCleanup;

				expiration.fetchRequested( fetch2Expire15, now );
				const nextCleanup2 = expiration.nextCleanup;

				// nextCleanup should have moved 5 minutes earlier.
				expect( nextCleanup2 ).to.eql( new Date( nextCleanup1.getTime() - ( 5 * 60 * 1000 ) ) );
			} );

			it ( 'should schedule an expiration timer, when an expiration is provided.', () => {
				const expireMargin = 1000;
				let timeout = null;
				const windowTimers = {
					setTimeout: ( cb, msecs ) => {
						timeout = { cb, msecs };
						return 232;
					},
					clearTimeout: ( id ) => {
						if ( 232 === id ) {
							timeout = null;
						}
					},
				};
				const expiration = new FetchExpiration( ( action ) => {}, windowTimers, expireMargin );

				expiration.fetchRequested( fetchExpire20, now );

				expect( timeout ).to.exist;
				expect( timeout.cb ).to.exist;
				expect( timeout.msecs ).to.equal( 20 * 60 * 1000 + expireMargin );

				// Add a fetch with a shorter expiration.
				expiration.fetchRequested( fetch2Expire15, now );

				expect( timeout ).to.exist;
				expect( timeout.msecs ).to.equal( 15 * 60 * 1000 + expireMargin );

				// Call the callback, as if the timeout was reached.
				const cb = timeout.cb;
				cb();

				expect( expiration.getFetchMeta( 'myService', 'myKey', 'lastUsed' ) ).to.not.exist;
				expect( expiration.getFetchMeta( 'myService', 'myKey', 'expirationMinutes' ) ).to.not.exist;
			} );
		} );
		describe( '#cleanExpired()', () => {

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

