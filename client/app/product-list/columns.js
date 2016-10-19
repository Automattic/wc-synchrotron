import React from 'react';
import * as cell from './cell-render';
import { translate as __ } from 'i18n-calypso';
import ColumnSelectIcon from './column-select-icon';

// Custom cell render functions.
const TAX_STATUS_NAMES = {
	taxable: __( 'Taxable' ),
	shipping: __( 'Shipping only' ),
	none: __( 'None' ),
};

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
		constraints: {
			min: 0,
			max: 1000000
		},
	},
	{
		key: 'price',
		title: __( 'Current Price' ),
		group: __( 'General' ),
		renderView: cell.renderCurrency,
	},
	{
		key: 'regular_price',
		title: __( 'Regular Price' ),
		group: __( 'General' ),
		renderView: cell.renderCurrency,
		renderEdit: cell.renderCurrencyInput,
	},
	{
		key: 'sale_price',
		title: __( 'Sale Price' ),
		group: __( 'General' ),
		renderView: cell.renderCurrency,
		renderEdit: cell.renderCurrencyInput,
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
		constraints: {
			min: 0,
			max: 1000000000000
		},
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
		renderView: ( product, key, constraints, helpers ) => {
			return TAX_STATUS_NAMES[ product[ key ] ];
		},
		renderEdit: cell.renderSelectInput,
		constraints: {
			getOptions: ( product, key, helpers ) => {
				let options = Object.keys( TAX_STATUS_NAMES ).map( ( value ) => {
					return { name: TAX_STATUS_NAMES[ value ], value };
				} );
				return options;
			}
		},
	},
	{
		key: 'tax_class',
		title: __( 'Tax class' ),
		group: __( 'Tax' ),
		renderView: ( product, key, constraints, helpers ) => {
			// If it's blank, it should show the first tax class from the list.

			const value = product[ key ];
			const taxClass = helpers.data.taxClasses.find( ( taxClass, index ) => {
				if ( value === taxClass.slug || 0 === value.length && 0 === index ) {
					return taxClass;
				}
			} );

			return ( taxClass ? taxClass.name : '' );
		},
		renderEdit: cell.renderSelectInput,
		constraints: {
			getOptions: ( product, key, helpers ) => {
				return helpers.data.taxClasses.map( ( taxClass ) => {
					return {
						name: taxClass.name,
						value: taxClass.slug,
					}
				} );
			},
		},
	},
	{
		key: 'categories',
		title: __( 'Categories' ),
		group: __( 'Organization' ),
		renderView: cell.renderCategories,
		renderEdit: cell.renderTokenField,
		constraints: {
			inConvert: ( categories, helpers ) => {
				return categories.map( ( category ) => {
					return category.name;
				} );
			},
			outConvert: ( names, helpers ) => {
				// Reject any names that aren't in categories already.
				// This keeps people from entering values that aren't valid
				return helpers.data.categories.filter( ( category ) => {
					if ( names.includes( category.name ) ) {
						return category.name;
					}
				} );
			},
			getSuggestions: ( product, key, helpers ) => {
				return helpers.data.categories.map( ( category ) => {
					return category.name;
				} );
			}
		}
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
		renderView: cell.renderBoolean,
		renderEdit: cell.renderCheckboxInput,
		constraints: {
			trueValue: 'visible',
			falseValue: '',
			trueValues: [ 'visible' ],
		}
	},
	{
		key: 'featured',
		title: __( 'Featured' ),
		group: __( 'Exposure' ),
		renderView: cell.renderBoolean,
		renderEdit: cell.renderCheckboxInput,
		constraints: {
			trueIcon: 'heart',
			falseIcon: null,
		},
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

