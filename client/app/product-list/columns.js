import React from 'react';
import * as cell from './cell-render';
import { translate as __ } from 'i18n-calypso';
import ColumnSelectIcon from './column-select-icon';

// Custom cell render functions.
function renderVisibility( product, key ) {
	return cell.renderBoolean( product, key, [ 'visible' ] );
}

function renderFeatured( product, key ) {
	return cell.renderBoolean( product, key, [ true ], 'heart', null );
}

// Column table for products: Index order matters!!
export default [
	{
		key: 'name',
		title: __( 'Name' ),
		group: null,
		renderView: cell.renderString,
		renderEdit: cell.renderTextInput,
	},
	{
		key: 'sku',
		title: __( 'SKU' ),
		group: __( 'General' ),
		renderView: cell.renderString,
		renderEdit: cell.renderTextInput,
	},
	{
		key: 'price',
		title: __( 'Price' ),
		group: __( 'General' ),
		renderView: cell.renderCurrency,
	},
	{
		key: 'dimensions',
		title: __( 'L/W/H' ),
		group: __( 'General' ),
		renderView: cell.renderDimensions,
	},
	{
		key: 'weight',
		title: __( 'Weight' ),
		group: __( 'General' ),
		renderView: cell.renderString,
		renderEdit: cell.renderNumberInput,
	},
	{
		key: 'sale_price',
		title: __( 'Sale Price' ),
		group: __( 'General' ),
		renderView: cell.renderCurrency,
	},
	{
		key: 'in_stock',
		title: __( 'Stock' ),
		group: __( 'Inventory' ),
		renderView: cell.renderBoolean,
		renderEdit: cell.renderCheckboxInput,
	},
	{
		key: 'manage_stock',
		title: __( 'Manage stock' ),
		group: __( 'Inventory' ),
		renderView: cell.renderBoolean,
		renderEdit: cell.renderCheckboxInput,
	},
	{
		key: 'stock_quantity',
		title: __( 'Stock quantity' ),
		group: __( 'Inventory' ),
		renderView: cell.renderInteger,
		renderEdit: cell.renderNumberInput,
	},
	{
		key: 'shipping_class',
		title: __( 'Shipping class' ),
		group: __( 'Inventory' ),
		renderView: cell.renderString,
	},
	{
		key: 'tax_status',
		title: __( 'Tax status' ),
		group: __( 'Tax' ),
		renderView: cell.renderString,
	},
	{
		key: 'tax_class',
		title: __( 'Tax class' ),
		group: __( 'Tax' ),
		renderView: cell.renderString,
	},
	{
		key: 'categories',
		title: __( 'Categories' ),
		group: __( 'Organization' ),
		renderView: cell.renderCategories,
	},
	{
		key: 'tags',
		title: __( 'Tags' ),
		group: __( 'Organization' ),
		renderView: cell.renderTags,
	},
	{
		key: 'catalog_visibility',
		title: __( 'Visibility' ),
		group: __( 'Exposure' ),
		renderView: renderVisibility,
		renderEdit: cell.renderCheckboxInput,
	},
	{
		key: 'featured',
		title: __( 'Featured' ),
		group: __( 'Exposure' ),
		renderView: renderFeatured,
		renderEdit: cell.renderCheckboxInput,
	},
	{
		key: 'backorders',
		title: __( 'Backorders' ),
		group: __( 'Misc' ),
		renderView: cell.renderBoolean,
		renderEdit: cell.renderCheckboxInput,
	},
	{
		key: 'sold_individually',
		title: __( 'Sold invidivually' ),
		group: __( 'Misc' ),
		renderView: cell.renderBoolean,
		renderEdit: cell.renderCheckboxInput,
	},
	{
		key: 'action',
		group: null,
		title: ( props ) => <ColumnSelectIcon { ...props } />,
	},
];

