import React, { PropTypes } from 'react';
import { localize } from 'i18n-calypso';
import SearchCard from 'components/search-card';
import ListTable from './list-table';
import * as cell from './cell-render';
import columns from './columns';

class ListBody extends React.Component {
	propTypes: {
		products: PropTypes.object.isRequired,
		edits: PropTypes.object.isRequired,
		editable: PropTypes.bool.isRequired,
		display: PropTypes.object.isRequired,
		setDisplayOption: PropTypes.func.isRequired,
		updateProduct: PropTypes.func.isRequired,
	}

	constructor( props ) {
		super( props );

		this.onColumnSelectIconClick = this.onColumnSelectIconClick.bind( this );
		this.onColumnSelect = this.onColumnSelect.bind( this );
		this.onEdit = this.onEdit.bind( this );
	}

	onColumnSelectIconClick( evt ) {
		evt.preventDefault();

		const { display, setDisplayOption } = this.props;

		// Toggle the display state of the column select.
		setDisplayOption( 'showColumnPanel', ! display.showColumnPanel );
	}

	onColumnSelect( key, selected ) {
		const prevKeys = this.props.display.selectedColumnKeys;

		let keys = new Set( prevKeys );

		if ( selected ) {
			keys.add( key );
		} else {
			keys.delete( key );
		}

		this.props.setDisplayOption( 'selectedColumnKeys', keys );
	}

	onEdit( product, key, value ) {
		const { products, updateProduct } = this.props;

		const newProduct = Object.assign( {}, product, { [ key ]: value } );
		updateProduct( products.indexOf( product ), newProduct );
	}

	render() {
		const { products, edits, editable, display } = this.props;
		const onSearch = () => {}; // TODO: hook up to search/filter action.

		return (
			<div className="product-list__body">
				<SearchCard onSearch={ onSearch } />
				<ListTable
					products={ products }
					edits={ edits }
					display={ display }
					editable={ editable }
					columns={ columns }
					selectedColumnKeys={ display.selectedColumnKeys }
					onColumnSelectIconClick={ this.onColumnSelectIconClick }
					onColumnSelect={ this.onColumnSelect }
					onEdit={ this.onEdit }
				/>
			</div>
		);
	}
}

export default localize( ListBody );

