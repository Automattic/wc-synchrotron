import { handleActions } from 'redux-actions';
import { TYPES } from './actions';

const initialState = {
};

export default handleActions( {
	[ TYPES.FETCHING ]: dataFetching,
	[ TYPES.FETCHED ]: dataFetched,
	[ TYPES.ERROR ]: dataFetchError,
}, initialState );

function dataFetching( state, action ) {
	const { service, key } = action.payload;

	return updateLastFetchTime( state, service, key, Date.now() );
}

function dataFetched( state, action ) {
	const { service, key, data } = action.payload;

	let newState = updateData( state, service, key, data );
	newState = clearErrors( newState, service, key );
	newState = updateLastSuccessTime( newState, service, key, Date.now() );

	return newState;
}

function dataFetchError( state, action ) {
	const { service, key, error } = action.payload;

	// Stamp the error with the time it was received.
	return appendError( state, service, key, { ...error, time: Date.now() } );
}

// Internal utility functions.

function updateData( state, service, key, data ) {
	const prevService = state[ service ] || {};
	const prevKey = prevService[ key ] || {};

	return { ...state,
		[ service ]: { ...prevService,
			[ key ]: data,
		},
	};
}

function updateLastFetchTime( state, service, key, time ) {
	return setStatus( state, service, key, ( prevStatus ) => {
		return {
			...prevStatus,
			lastFetchTime: time,
		};
	} );
}

function updateLastSuccessTime( state, service, key, time ) {
	return setStatus( state, service, key, ( prevStatus ) => {
		return {
			...prevStatus,
			lastSuccessTime: time,
		};
	} );
}

function appendError( state, service, key, error ) {
	return setStatus( state, service, key, ( prevStatus ) => {
		return {
			...prevStatus,
			errors: [ ...prevStatus.errors, error ],
		};
	} );
}

function clearErrors( state, service, key ) {
	return setStatus( state, service, key, ( prevStatus ) => {
		const { errors, ...noErrorsStatus } = prevStatus;
		return noErrorsStatus;
	} );
}

function setStatus( state, service, key, updater ) {
	const serviceStatus = service + '_status';
	const prevStatus = state[ serviceStatus ] || {};
	const prevKeyStatus = prevStatus[ key ] || {};

	return { ...state,
		[ serviceStatus ]: { ...prevStatus,
			[ key ]: updater( prevKeyStatus ),
		},
	};
}

