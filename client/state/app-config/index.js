import { handleActions } from 'redux-actions';
import { registerActionTypes } from '../actions-registry';

const MODULE_NAME = 'app-config';

const registeredActions = registerActionTypes( MODULE_NAME, [
	'SET_CONFIG',
] );

const TYPES = registeredActions.types;
const ACTIONS = registeredActions.actions;

const initialState = {};

export function getConfig( reduxState ) {
	return ( key ) => {
		return reduxState[ MODULE_NAME ][ key ];
	};
}

export function setConfig( key, value ) {
	return ACTIONS.SET_CONFIG( { [ key ]: value } );
}

export default handleActions( {
	[ TYPES.SET_CONFIG ]: handleSetConfig,
}, initialState );

function handleSetConfig( state, action ) {
	return Object.assign( {}, state, action.payload );
}

