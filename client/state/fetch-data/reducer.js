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
	const lastFetchTime = Date.now();

	const serviceNode = state[ service ] || {};
	const dataNode = serviceNode[ key ] || {};

	const newDataNode = Object.assign( {}, dataNode, {
		lastFetchTime,
	} );

	const newServiceNode = Object.assign( {}, serviceNode, {
		[ key ]: newDataNode,
	} );

	return Object.assign( {}, state, {
		[ service ]: newServiceNode,
	} );
}

function dataFetched( state, action ) {
	const { service, key, data } = action.payload;
	const lastSuccessTime = Date.now();

	const serviceNode = state[ service ] || {};
	const dataNode = serviceNode[ key ] || {};

	const newDataNode = Object.assign( {}, dataNode, {
		data,
		lastSuccessTime,
	} );

	// Successful fetch, clear error.
	delete newDataNode.error;
	delete newDataNode.lastErrorTime;

	const newServiceNode = Object.assign( {}, serviceNode, {
		[ key ]: newDataNode,
	} );

	return Object.assign( {}, state, {
		[ service ]: newServiceNode,
	} );
}

function dataFetchError( state, action ) {
	const { service, key, error } = action.payload;
	const lastErrorTime = Data.now();

	const serviceNode = state[ service ] || {};
	const dataNode = serviceNode[ key ] || {};

	const newDataNode = Object.assign( {}, dataNode, {
		error,
		lastErrorTime,
	} );

	const newServiceNode = Object.assign( {}, serviceNode, {
		[ key ]: newDataNode,
	} );

	return Object.assign( {}, state, {
		[ service ]: newServiceNode,
	} );

	return state;
}

