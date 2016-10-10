import { handleActions } from 'redux-actions';
import { TYPES } from './actions';

const initialState = {
};

export default handleActions( {
	[ TYPES.FETCHED ]: dataFetched,
}, initialState );

function dataFetched( state, action ) {
	const { service, query, data } = action.payload;

	const serviceNode = Object.assign( {}, state[ service ], {
		[ query ]: data
	} );

	return Object.assign( {}, state, {
		[ service ]: serviceNode
	} );
}

