import debug from 'debug';
import { deleteFetch } from './actions';

const log = debug( 'synchrotron:fetch-data' );

export default class FetchExpiration {

	constructor( dispatch, windowTimers, expireMargin = 1000 ) {
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
		this.dispatch = dispatch;
		this.windowTimers = windowTimers;
		this.expireMargin = expireMargin;

		this.cleanExpired = this.cleanExpired.bind( this );
		this.updateNextCleanup = this.updateNextCleanup.bind( this );
	}

	fetchRequested( fetch, now = new Date() ) {
		log( 'fetch ' + fetch.service + ':' + fetch.key + ' requested at ' + now );
		this.setFetchMeta( fetch.service, fetch.key, 'lastUsed', new Date( now ) );
		this.updateExpiration( fetch, now );
	}

	cleanExpired( dispatch = this.dispatch, now = new Date() ) {
		log( 'cleaning out all expired fetches at: ' + now );

		const newMeta = {};
		const actions = [];

		// Iterate the entire list of fetches,
		// Queue up actions for the ones that have expired.
		for ( let service in this.meta ) {
			const serviceMeta = this.meta[ service ];
			newMeta[ service ] = {};

			for ( let key in serviceMeta ) {
				const fetchMeta = serviceMeta[ key ];

				if ( this.isExpired( fetchMeta, now ) ) {
					log( 'deleting fetch ' + service + ':' + key );
					actions.push( deleteFetch( service, key ) );
				} else {
					// Only copy over non-expired fetches.
					newMeta[ service ][ key ] = fetchMeta;
				}
			}
		}

		this.meta = newMeta;
		this.nextCleanup = null;

		// Send of all the actions at once, so as to not disturb this.meta.
		// Note: This requires redux-multi
		dispatch( actions );
	}

	isExpired( fetchMeta, now ) {
		const { lastUsed, expirationMinutes } = fetchMeta;
		const expirationTimeMsecs = lastUsed.getTime() + ( expirationMinutes * 60 * 1000 );

		return now > expirationTimeMsecs;
	}

	updateExpiration( fetch, now ) {
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
			this.updateNextCleanup( fetchExpire, now );
		}
	}

	updateNextCleanup( nextExpire, now, dispatch = this.dispatch ) {
		if ( nextExpire ) {
			const proposedCleanup = new Date( nextExpire.getTime() + this.expireMargin );

			if ( ! this.nextCleanup || proposedCleanup < this.nextCleanup ) {
				this.nextCleanup = proposedCleanup;
				log( 'setting nextCleanup to: ' + this.nextCleanup );

				this.adjustTimer( this.nextCleanup, now );
			}
		} else {
			log( 'no expirations found, no nextCleanup scheduled.' );
		}
	}

	adjustTimer( nextCleanup, now ) {
		if ( ! this.windowTimers ) {
			// No WindowTimers object available, abort.
			return;
		}

		// Clear the existing timer, if there is one.
		if ( this.timerId ) {
			this.windowTimers.clearTimeout( this.timerId );
		}

		// Set up a new timer for the proposed time.
		const millisecondsFromNow = nextCleanup.getTime() - now.getTime();
		this.timerId = this.windowTimers.setTimeout(
			() => {
				this.cleanExpired();
				this.updateNextCleanup( this.findNextExpiration(), new Date() );
			},
			millisecondsFromNow
		);
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

