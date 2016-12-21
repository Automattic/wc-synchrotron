import debug from 'debug';
import { deleteFetch } from './actions';

const log = debug( 'synchrotron:fetch-data' );

export default class FetchExpiration {

	constructor( dispatch ) {
		/**
		 * Metadata for fetches.
		 *
		 * Shape: {
		 *  [ 'service' ]: {
		 *    [ 'key' ]: {
		 *      lastUsed: <Date>
		 *      expirationMinutes: <Number>
		 *    }
		 *  }
		 */
		this.meta = {};
		this.nextCleanup = null;
		this.dispach = dispatch;
	}

	fetchRequested( fetch, time = new Date() ) {
		this.setFetchMeta( fetch.service, fetch.key, 'lastUsed', new Date( time ) );
		this.updateExpiration( fetch );
	}

	cleanExpired( dispatch = this.dispatch, now = new Date() ) {
		log( 'cleaning out all expired fetches...' );

		const expiredFetches = [];

		for ( let service in this.meta ) {
			const serviceMeta = this.meta[ service ];
			for ( let key in serviceMeta ) {
				const fetchMeta = serviceMeta[ key ];
				if ( this.isExpired( fetchMeta, now ) ) {
					expiredFetches.push( fetchMeta );
				}
			}
		}

		expiredFetches.forEach( ( fetchMeta ) => {
			this.deleteFetch( fetchMeta.service, fetchMeta.key, dispatch );
		} );
	}

	deleteFetch( service, key, dispatch = this.dispatch ) {
		log( 'deleting fetch: ' + service + ":" + key );

		const serviceMeta = this.meta[ service ];

		delete serviceMeta[ key ];
		dispatch( deleteFetch( service, key ) );
	}

	isExpired( fetchMeta, now ) {
		const { lastUsed, expirationMinutes } = fetchMeta;
		const expirationTimeMsecs = lastUsed.getTime() + ( expirationMinutes * 60 * 1000 );

		return now > expirationTimeMsecs;
	}

	updateExpiration( fetch ) {
		const { service, key } = fetch;

		if ( fetch.expirationMinutes ) {
			const fetchMeta = this.meta[ service ][ key ];

			const newMins = fetch.expirationMinutes;
			const oldMins = fetchMeta.expirationMinutes;

			// If the new expiration is longer, use it instead.
			if ( ! oldMins || newMins > oldMins ) {
				fetchMeta[ 'expirationMinutes' ] = newMins;
			}

			// Either way, update next cleanup as needed.
			const fetchExpire = this.getFetchExpiration( fetchMeta );
			this.updateNextCleanup( fetchExpire );
		}
	}

	updateNextCleanup( nextExpire ) {
		if ( nextExpire ) {
			if ( ! this.nextCleanup || nextExpire < this.nextCleanup ) {
				this.nextCleanup = nextExpire;
				console.log( 'setting nextCleanup to: ' + this.nextCleanup );
			}
		}
	}

	getFetchExpiration( fetchMeta ) {
		const { lastUsed, expirationMinutes } = fetchMeta;
		let fetchExpire = null;

		if ( expirationMinutes && lastUsed ) {
			fetchExpire = new Date( lastUsed.getTime() + ( expirationMinutes * 60 * 1000 ) );
		}

		return fetchExpire;
	}

	findNextExpiration() {
		let nextExpire = null;

		for ( let service in this.meta ) {
			const serviceMeta = this.meta[ service ];
			for ( let key in serviceMeta ) {
				const fetchMeta = serviceMeta[ key ];
				const fetchExpire = this.getFetchExpiration( fetchMeta );

				// If this fetch expires earlier than the others, use this one.
				if ( ! nextExpire || fetchExpire < nextExpire ) {
					nextExpire = fetchExpire;
				}
			}
		}

		return nextExpire;
	}

	getFetchMeta( service, key, name ) {
		const serviceMeta = this.meta[ service ] || {};
		const keyMeta = serviceMeta[ key ] || {};

		return keyMeta[ name ];
	}

	setFetchMeta( service, key, name, value ) {
		let serviceMeta = this.meta[ service ];

		// If service doesn't exist, add it now.
		if ( ! serviceMeta ) {
			serviceMeta = {};
			this.meta[ service ] = serviceMeta;
		}

		// If key doesn't exist, add it now.
		let keyMeta = serviceMeta[ key ];
		if ( ! keyMeta ) {
			keyMeta = { service, key };
			serviceMeta[ key ] = keyMeta;
		}

		keyMeta[ name ] = value;
	}
}

