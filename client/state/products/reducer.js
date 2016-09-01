import { handleActions } from 'redux-actions';
import { TYPES } from './actions';

export const initialState = {
	isFetching: false,
	isFetched: false,
	error: null,
	products: [],
	edits: null,
	display: {
		showColumnPanel: false,
		selectedColumns: new Set( [ 'name', 'price', 'stock_quantity', 'action' ] ),
	},
};

export default handleActions( {
	[ TYPES.FETCHING ]: productsFetching,
	[ TYPES.FETCHED ]: productsFetched,
	[ TYPES.INIT_EDITS ]: initEdits,
	[ TYPES.CLEAR_EDITS ]: clearEdits,
	[ TYPES.ADD_PRODUCT ]: editAdd,
	[ TYPES.UPDATE_PRODUCT ]: editUpdate,
	[ TYPES.DELETE_PRODUCT ]: editDelete,
	[ TYPES.SET_DISPLAY_OPTION ]: productsSetDisplayOption,
	[ TYPES.SET_ERROR ]: productsError,
}, initialState );

export function productsFetching( state ) {
	return Object.assign( {}, state, {
		isFetching: true,
		isFetched: false,
		error: null,
	} );
}

export function productsFetched( state, action ) {
	return Object.assign( {}, state, {
		isFetching: false,
		isFetched: true,
		error: null,
		products: action.payload,
	} );
}

export function initEdits( state, action ) {
	if ( ! state.edits ) {
		return Object.assign( {}, state, {
			edits: {},
		} );
	} else {
		// Edits already initialized.
		return state;
	}
}

export function clearEdits( state, action ) {
	if ( null !== state.edits ) {
		return Object.assign( {}, state, {
			edits: null,
		} );
	} else {
		// No edits to clear.
		return state;
	}
}

export function editAdd( state, action ) {
	const data = {};
	const edits = state.edits || {};
	const adds = edits.adds || [];

	// Create a new product object. Always add it to the beginning of the array.
	const newAdds = [ data, ...adds ];
	const newEdits = Object.assign( {}, edits, { adds: newAdds } );
	const newState = Object.assign( {}, state, { edits: newEdits } );

	return newState;
}

export function editUpdate( state, action ) {
	const { index, data } = action.payload;
	const edits = state.edits || {};
	const updates = state.updates || {};

	// Assign the updated product data to its id under the updates object.
	const newUpdates = Object.assign( {}, updates, { [ data.id ]: data } );
	const newEdits = Object.assign( {}, edits, { updates: newUpdates } );
	const newState = Object.assign( {}, state, { edits: newEdits } );

	return newState;
}

export function editDelete( state, action ) {
	const { id } = action.payload;
	const edits = state.edits || {};
	const deletes = edits.deletes || [];

	// Add the id of the product to delete.
	const newDeletes = [ ...deletes, id ];
	const newEdits = Object.assign( {}, edits, { deletes: newDeletes } );
	const newState = Object.assign( {}, state, { edits: newEdits } );

	return newState;
}


export function productsSetDisplayOption( state, action ) {
	const { option, value } = action.payload;
	const display = Object.assign( {}, state.display, { [option]: value } );

	return Object.assign( {}, state, {
		display
	} );
}

export function productsError( state, action ) {
	return Object.assign( {}, state, {
		isFetching: false,
		isFetched: false,
		error: action.payload,
	} );
}

