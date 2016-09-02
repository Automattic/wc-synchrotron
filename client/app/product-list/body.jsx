import React, { PropTypes } from 'react';
import { localize } from 'i18n-calypso';
import Button from 'components/button';
import Gridicon from 'gridicons/react/gridicon';
import SearchCard from 'components/search-card';
import ColumnMenu from './column-menu';
import ListTable from './list-table';
import * as cell from './cell-render';

class ListBody extends React.Component {
	propTypes: {
		products: PropTypes.object.isRequired,
		editable: PropTypes.bool.isRequired,
		display: PropTypes.object.isRequired,
		setDisplayOption: PropTypes.func.isRequired,
	}

	constructor( props ) {
		super( props );

		this.renderColumnSelectIcon = this.renderColumnSelectIcon.bind( this );
		this.onColumnSelectIconClick = this.onColumnSelectIconClick.bind( this );
		this.onColumnSelect = this.onColumnSelect.bind( this );

		this.columns = this.initializeColumns();
	}

	initializeColumns() {
		const __ = this.props.translate;

		const general      = __( 'General' );
		const inventory    = __( 'Inventory' );
		const tax          = __( 'Tax' );
		const organization = __( 'Organization' );
		const exposure     = __( 'Exposure' );
		const misc         = __( 'Misc' );

		const renderVisibility = ( product, key ) => this.renderBoolean( product, key, [ 'visible' ] );
		const renderFeatured = ( product, key ) => this.renderBoolean( product, key, [ true ], 'heart', null );

		return [
			{ group: null,         key: 'name',               title: __( 'Name' ),                view: cell.renderString },
			{ group: general,      key: 'sku',                title: __( 'SKU' ),                 view: cell.renderString, edit: cell.renderTextInput },
			{ group: general,      key: 'price',              title: __( 'Price' ),               view: cell.renderCurrency },
			{ group: general,      key: 'dimensions',         title: __( 'L/W/H' ),               view: cell.renderDimensions },
			{ group: general,      key: 'weight',             title: __( 'Weight' ),              view: cell.renderString },
			{ group: general,      key: 'sale_price',         title: __( 'Sale Price' ),          view: cell.renderCurrency },
			{ group: inventory,    key: 'in_stock',           title: __( 'Stock' ),               view: cell.renderBoolean },
			{ group: inventory,    key: 'manage_stock',       title: __( 'Manage stock' ),        view: cell.renderBoolean },
			{ group: inventory,    key: 'stock_quantity',     title: __( 'Stock quantity' ),      view: cell.renderInteger },
			{ group: inventory,    key: 'shipping_class',     title: __( 'Shipping class' ),      view: cell.renderString },
			{ group: tax,          key: 'tax_status',         title: __( 'Tax status' ),          view: cell.renderString },
			{ group: tax,          key: 'tax_class',          title: __( 'Tax class' ),           view: cell.renderString },
			{ group: organization, key: 'categories',         title: __( 'Categories' ),          view: cell.renderCategories },
			{ group: organization, key: 'tags',               title: __( 'Tags' ),                view: cell.renderTags },
			{ group: exposure,     key: 'catalog_visibility', title: __( 'Visibility' ),          view: renderVisibility },
			{ group: exposure,     key: 'featured',           title: __( 'Featured' ),            view: renderFeatured },
			{ group: misc,         key: 'backorders',         title: __( 'Backorders' ),          view: cell.renderBoolean },
			{ group: misc,         key: 'sold_individually',  title: __( 'Sold invidivually' ),   view: cell.renderBoolean },
			{ group: null,         key: 'action',             title: this.renderColumnSelectIcon },
		];
	}

	onColumnSelectIconClick( evt ) {
		evt.preventDefault();

		const { display, setDisplayOption } = this.props;

		// Toggle the display state of the column select.
		setDisplayOption( 'showColumnPanel', ! display.showColumnPanel );
	}

	onColumnSelect( key, selected ) {
		const prevSelectedColumns = this.props.display.selectedColumns;

		let selectedColumns = new Set( prevSelectedColumns );

		if ( selected ) {
			selectedColumns.add( key );
		} else {
			selectedColumns.delete( key );
		}

		this.props.setDisplayOption( 'selectedColumns', selectedColumns );
	}

	render() {
		const { products, editable, display } = this.props;
		const onSearch = () => {}; // TODO: hook up to search/filter action.

		return (
			<div className="product-list__body">
				<SearchCard onSearch={ onSearch } />
				<ListTable
					ref="listTable"
					products={ products }
					editable={ editable }
					columns={ this.columns }
					selectedColumns={ display.selectedColumns }
				/>
			</div>
		);
	}

	renderColumnSelectIcon() {
		const __ = this.props.translate;
		const { display } = this.props;
		const columns = this.columns;

		// Drill down to the ref for the column select button (this will be null upon first render)
		const listTableRef = this.refs && this.refs.listTable;
		const headerRef = listTableRef && listTableRef.getListHeaderRef();
		const columnSelectRef = headerRef && headerRef.refs && headerRef.refs.columnSelect;

		return (
			<Button borderless ref="columnSelect" onClick={ this.onColumnSelectIconClick }>
				<Gridicon icon="grid" />
				<ColumnMenu
					columns={ columns }
					selectedColumns={ display.selectedColumns }
					context={ columnSelectRef }
					isVisible={ display.showColumnPanel }
					onColumnSelect={ this.onColumnSelect }
				/>
			</Button>
		);
	}
}

export default localize( ListBody );

