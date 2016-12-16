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

	let newState = updateValue( state, service, key, data );
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

function updateValue( state, service, key, value ) {
	const serviceNode = state[ service ] || {};
	const keyNode = serviceNode[ key ] || {};

	return { ...state,
		[ service ]: { ...serviceNode,
			[ key ]: { ...keyNode,
				value,
			},
		},
	};
}

function updateLastFetchTime( state, service, key, time ) {
	return setStatus( state, service, key, ( status ) => {
		return {
			...status,
			lastFetchTime: time,
		};
	} );
}

function updateLastSuccessTime( state, service, key, time ) {
	return setStatus( state, service, key, ( status ) => {
		return {
			...status,
			lastSuccessTime: time,
		};
	} );
}

function appendError( state, service, key, error ) {
	return setStatus( state, service, key, ( status ) => {
		return {
			...status,
			errors: [ ...status.errors, error ],
		};
	} );
}

function clearErrors( state, service, key ) {
	return setStatus( state, service, key, ( status ) => {
		const { errors, ...noErrorsStatus } = status;
		return noErrorsStatus;
	} );
}

function setStatus( state, service, key, updater ) {
	const serviceNode = state[ service ] || {};
	const keyNode = serviceNode[ key ] || {};
	const status = keyNode.status || {};

	return { ...state,
		[ service ]: { ...serviceNode,
			[ key ]: { ...keyNode,
				status: updater( status ),
			},
		},
	};
}

