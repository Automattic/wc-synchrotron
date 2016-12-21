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
		this.dispach = dispatch;
	}

	fetchRequested( fetch, time = Date.now() ) {
		this.updateExpiration( fetch );

		this.setFetchMeta( fetch.service, fetch.key, 'lastUsed', time );
	}

	cleanExpired( dispatch = this.dispatch, now = Date.now() ) {
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
		const expirationTime = lastUsed.getTime() + ( expirationMinutes * 60 * 1000 );

		return now.getTime() > expirationTime;
	}

	updateExpiration( fetch ) {
		const { service, key } = fetch;

		if ( fetch.expirationMinutes ) {
			const newMins = fetch.expirationMinutes;
			const oldMins = this.getFetchMeta( service, key, 'expirationMinutes' );

			// If the new expiration is longer, use it instead.
			if ( ! oldMins || newMins > oldMins ) {
				this.setFetchMeta( service, key, 'expirationMinutes', newMins );
			}
		}
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

