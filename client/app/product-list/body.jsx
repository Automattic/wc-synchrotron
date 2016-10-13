import React, { PropTypes } from 'react';
import { localize } from 'i18n-calypso';
import SearchCard from 'components/search-card';
import ListTable, { createRenderHelpers } from './list-table';
import * as cell from './cell-render';
import columns from './columns';

class ListBody extends React.Component {
	propTypes: {
		products: PropTypes.object.isRequired,
		categories: PropTypes.array.isRequired,
		edits: PropTypes.object.isRequired,
		editable: PropTypes.bool.isRequired,
		disabled: PropTypes.bool.isRequired,
		display: PropTypes.object.isRequired,
		setDisplayOption: PropTypes.func.isRequired,
		editProduct: PropTypes.func.isRequired,
		currencySymbol: PropTypes.string.isRequired,
		currencyDecimals: PropTypes.number.isRequired,
		currencyIsPrefix: PropTypes.bool.isRequired,
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
		const { products, editProduct } = this.props;

		editProduct( product.id, key, value );
	}

	render() {
		const { products, categories, edits, editable, disabled, display } = this.props;
		const { currencySymbol, currencyIsPrefix, currencyDecimals, numberFormat } = this.props;
		const onSearch = () => {}; // TODO: hook up to search/filter action.

		const renderHelpers = createRenderHelpers(
			currencySymbol,
			currencyIsPrefix,
			currencyDecimals,
			numberFormat,
			{
				categories
			}
		);

		return (
			<div className="product-list__body">
				<SearchCard onSearch={ onSearch } />
				<ListTable
					products={ products }
					edits={ edits }
					display={ display }
					editable={ editable }
					disabled={ disabled }
					columns={ columns }
					selectedColumnKeys={ display.selectedColumnKeys }
					onColumnSelectIconClick={ this.onColumnSelectIconClick }
					onColumnSelect={ this.onColumnSelect }
					onEdit={ this.onEdit }
					renderHelpers={ renderHelpers }
				/>
			</div>
		);
	}
}

export default localize( ListBody );

