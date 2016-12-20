import { expect } from 'chai';
import FetchExpiration from '../fetch-expiration';

describe( 'expiration', () => {
	describe( '#FetchExpiration()', () => {
		describe( '#fetchRequested()', () => {
			const fetchNoExpire = { service: 'myService', key: 'myKey' };
			const fetchExpire20 = { service: 'myService', key: 'myKey', expirationMinutes: 20 };
			const fetchExpire10 = { service: 'myService', key: 'myKey', expirationMinutes: 10 };
			const earlier = new Date( 2016, 12, 20, 17, 2, 35 );
			const now = new Date( 2016, 12, 20, 17, 11, 20 );

			it ( 'should store lastUsed timestamp', () => {
				const expiration = new FetchExpiration();

				expiration.fetchRequested( fetchNoExpire, now );

				expect( expiration.getFetchMeta( 'myService', 'myKey', 'lastUsed' ) ).to.equal( now );
				expect( expiration.getFetchMeta( 'myService', 'myKey', 'expirationMinutes' ) ).to.not.exist;
			} );

			it ( 'should overwrite lastUsed in subsequent calls', () => {
				const expiration = new FetchExpiration();

				expiration.fetchRequested( fetchNoExpire, earlier );
				expiration.fetchRequested( fetchNoExpire, now );

				expect( expiration.getFetchMeta( 'myService', 'myKey', 'lastUsed' ) ).to.equal( now );
			} );

			it ( 'should overwrite expiration when not present before', () => {
				const expiration = new FetchExpiration();

				expiration.fetchRequested( fetchNoExpire, now );
				expiration.fetchRequested( fetchExpire20, now );

				expect( expiration.getFetchMeta( 'myService', 'myKey', 'expirationMinutes' ) ).to.equal( 20 );
			} );

			it ( 'should overwrite expiration when a longer expiration is specified', () => {
				const expiration = new FetchExpiration();

				expiration.fetchRequested( fetchExpire10, now );
				expiration.fetchRequested( fetchExpire20, now );

				expect( expiration.getFetchMeta( 'myService', 'myKey', 'expirationMinutes' ) ).to.equal( 20 );
			} );
		} );
	} );
} );

