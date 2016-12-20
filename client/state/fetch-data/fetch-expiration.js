
export default class FetchExpiration {

	constructor() {
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
	}

	fetchRequested( fetch, time = Date.now() ) {
		this.updateExpiration( fetch );

		this.setFetchMeta( fetch.service, fetch.key, 'lastUsed', time );
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
			keyMeta = {};
			serviceMeta[ key ] = keyMeta;
		}

		keyMeta[ name ] = value;
	}
}

