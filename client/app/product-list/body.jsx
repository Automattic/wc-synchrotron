import React, { PropTypes } from 'react';
import { localize } from 'i18n-calypso';
import Button from 'components/button';
import Gridicon from 'components/gridicon';
import SearchCard from 'components/search-card';
import ColumnMenu from './column-menu';
import ListTable from './list-table';

class ListBody extends React.Component {
	propTypes: {
		products: PropTypes.object.isRequired,
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

		return [
			{ group: null,         key: 'name',               title: __( 'Name' ),                func: this.renderString },
			{ group: general,      key: 'sku',                title: __( 'SKU' ),                 func: this.renderString },
			{ group: general,      key: 'price',              title: __( 'Price' ),               func: this.renderCurrency },
			{ group: general,      key: 'dimensions',         title: __( 'L/W/H' ),               func: this.renderDimensions },
			{ group: general,      key: 'weight',             title: __( 'Weight' ),              func: this.renderString },
			{ group: general,      key: 'sale_price',         title: __( 'Sale Price' ),          func: this.renderCurrency },
			{ group: inventory,    key: 'stock',              title: __( 'Stock' ),               func: this.renderBoolean },
			{ group: inventory,    key: 'manage_stock',       title: __( 'Manage stock' ),        func: this.renderBoolean },
			{ group: inventory,    key: 'stock_quantity',     title: __( 'Stock quantity' ),      func: this.renderInteger },
			{ group: inventory,    key: 'shipping_class',     title: __( 'Shipping class' ),      func: this.renderString },
			{ group: tax,          key: 'tax_status',         title: __( 'Tax status' ),          func: this.renderString },
			{ group: tax,          key: 'tax_class',          title: __( 'Tax class' ),           func: this.renderString },
			{ group: organization, key: 'categories',         title: __( 'Categories' ),          func: this.renderCategories },
			{ group: organization, key: 'tags',               title: __( 'Tags' ),                func: this.renderTags },
			{ group: exposure,     key: 'catalog_visibility', title: __( 'Visibility' ),          func: this.renderBoolean },
			{ group: exposure,     key: 'featured',           title: __( 'Featured' ),            func: this.renderBoolean },
			{ group: misc,         key: 'backorders',         title: __( 'Backorders' ),          func: this.renderBoolean },
			{ group: misc,         key: 'sold_individually',  title: __( 'Sold invidivually' ),   func: this.renderBoolean },
			{ group: null,         key: 'action',             title: this.renderColumnSelectIcon, func: ( ) => null },
		];
	}

	// TODO: Put these functions in a helper file outside of a class.
	renderString( product, key ) {
		return product[key];
	}

	renderInteger( product, key, nanString = 'N/A' ) {
		const value = Number( product[key] );
		return ( ! isNaN( value ) ? value : nanString );
	}

	renderBoolean( product, key ) {
		// TODO: Render a graphic checkmark/x instead.
		return product[key];
	}

	renderCurrency( product, key ) {
		const value = product[key];
		// TODO: Get the currency symbol and format properly!!
		return '$' + value;
	}

	renderDimensions( product, key ) {
		const value = product[key];
		const l = Number( value.length );
		const w = Number( value.width );
		const h = Number( value.height );

		return l + '/' + w + '/' + h;
	}

	renderCategories( product, key ) {
		// TODO: Render names.
		return product[key];
	}

	renderTags( product, key ) {
		// TODO: Render tags.
		return product[key];
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
		const { products, display } = this.props;
		const onSearch = () => {}; // TODO: hook up to search/filter action.

		return (
			<div className="product-list__body">
				<SearchCard onSearch={ onSearch } />
				<ListTable
					ref="listTable"
					products={ products }
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

