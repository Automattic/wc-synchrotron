import omit from 'lodash.omit';
import { handleActions } from 'redux-actions';
import { TYPES } from './actions';
import { defaultColumnSelections } from '../../app/product-list/columns';

export const initialState = {
	isFetching: false,
	isFetched: false,
	error: null,
	products: [],
	edits: null,
	display: {
		showColumnPanel: false,
		columnSelections: defaultColumnSelections,
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
	// TODO: add create/delete
	const { update } = action.payload;

	let products = state.products;

	// Replace all products that have been updated.
	if ( update ) {
		const ids = update.map( ( p ) => p.id );

		products = state.products.map( ( product ) => {
			const index = ids.indexOf( product.id );
			return ( index > -1 ? update[ index ] : product );
		} );
	}

	return Object.assign( {}, state, {
		products,
		edits: null,
		saving: null,
	} );
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
	const { id, key, value } = action.payload;
	const edits = state.edits || {};
	const update = edits && edits.update || [];
	const entry = update.find( ( p ) => id === p.id ) || {};
	const newEntry = Object.assign( {}, entry, { id, [ key ]: value } );

	let newUpdate = update.filter( ( p ) => p.id != id );
	newUpdate.push( newEntry );

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
	const display = Object.assign( {}, state.display, { [ option ]: value } );

	return Object.assign( {}, state, {
		display
	} );
}

// TODO: Show error on page.
// TODO: Split this out to better functionality.
// Right now this is handling errors for both fetching and saving.
// And that's not the best solution. Both of those should be split out
// with their own error states, since it's theoretically possible to do
// both at the same time.
export function productsError( state, action ) {
	return Object.assign( {}, state, {
		isFetching: false,
		isFetched: false,
		edits: null,
		saving: null,
		error: action.payload,
	} );
}

