import { handleActions } from 'redux-actions';
import { TYPES } from './actions';

const initialState = {
};

export default handleActions( {
	[ TYPES.FETCHED ]: dataFetched,
}, initialState );

function dataFetched( state, action ) {
	const { service, key, data } = action.payload;

	const serviceNode = Object.assign( {}, state[ service ], {
		[ key ]: data
	} );

	return Object.assign( {}, state, {
		[ service ]: serviceNode
	} );
}

