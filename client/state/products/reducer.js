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
		selectedColumnKeys: new Set( [ 'name', 'price', 'stock_quantity', 'action' ] ),
	},
};

export default handleActions( {
	[ TYPES.FETCHING ]: productsFetching,
	[ TYPES.FETCHED ]: productsFetched,
	[ TYPES.INIT_EDITS ]: initEdits,
	[ TYPES.CANCEL_EDITS ]: cancelEdits,
	[ TYPES.SAVING_EDITS ]: savingEdits,
	[ TYPES.EDITS_SAVED ]: editsSaved,
	[ TYPES.ADD_PRODUCT ]: addProduct,
	[ TYPES.EDIT_PRODUCT ]: editProduct,
	[ TYPES.DELETE_PRODUCT ]: deleteProduct,
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

export function cancelEdits( state, action ) {
	return Object.assign( {}, state, {
		edits: null,
		saving: null,
	} );
}

export function savingEdits( state, action ) {
	// Save current edits set to a saving set.
	return Object.assign( {}, state, {
		saving: Object.assign( {}, state.edits )
	} );

	return state;
}

export function editsSaved( state, action ) {
	console.log( 'editsSaved' );
	return state;
}

export function addProduct( state, action ) {
	const data = {};
	const edits = state.edits || {};
	const add = edits.add || [];

	// Create a new product object. Always add it to the beginning of the array.
	const newAdd = [ data, ...add ];
	const newEdits = Object.assign( {}, edits, { add: newAdd } );
	const newState = Object.assign( {}, state, { edits: newEdits } );

	return newState;
}

export function editProduct( state, action ) {
	const { index, data } = action.payload;
	const edits = state.edits || {};
	const update = state.update || {};

	// Assign the updated product data to its id under the update object.
	const newUpdate = Object.assign( {}, update, { [ data.id ]: data } );
	const newEdits = Object.assign( {}, edits, { update: newUpdate } );
	const newState = Object.assign( {}, state, { edits: newEdits } );

	return newState;
}

export function deleteProduct( state, action ) {
	const { id } = action.payload;
	const edits = state.edits || {};
	const deletes = edits.delete || [];

	// Add the id of the product to delete.
	const newDelete = [ ...deletes, id ];
	const newEdits = Object.assign( {}, edits, { deletes: newDelete } );
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

