import { handleActions } from 'redux-actions';
import { TYPES } from './actions';

const initialState = {
};

export default handleActions( {
	[ TYPES.FETCHED ]: dataFetched,
	[ TYPES.ERROR ]: dataFetchError,
}, initialState );

function dataFetched( state, action ) {
	const { service, key, data } = action.payload;

	const serviceNode = state[ service ] || {};
	const dataNode = serviceNode[ key ] || {};

	const newDataNode = Object.assign( {}, dataNode, {
		data,
	} );
	delete newDataNode.error; // Successful fetch, remove any previous error.

	const newServiceNode = Object.assign( {}, serviceNode, {
		[ key ]: newDataNode,
	} );

	return Object.assign( {}, state, {
		[ service ]: newServiceNode,
	} );
}

function dataFetchError( state, action ) {
	const { service, key, error } = action.payload;

	const serviceNode = state[ service ] || {};
	const dataNode = serviceNode[ key ] || {};

	const newDataNode = Object.assign( {}, dataNode, {
		error,
	} );
	delete newDataNode.data; // Fetch failed, delete old data.

	const newServiceNode = Object.assign( {}, serviceNode, {
		[ key ]: newDataNode,
	} );

	return Object.assign( {}, state, {
		[ service ]: newServiceNode,
	} );

	return state;
}

