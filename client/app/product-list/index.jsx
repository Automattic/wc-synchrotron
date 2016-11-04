import React, { PropTypes } from 'react';
import { localize } from 'i18n-calypso';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TitleBar from '../../components/title-bar';
import ProductsBody from './body';
import Button from 'components/button';
import screenData from '../../utils/screen-data';
import * as wcApi from '../../data/wc-api';
import { getFetchProps } from '../../state/fetch-data';

// TODO: Combine product-specific code from index and body into one file.
// TODO: Make the entire list-table component general and move it to client/components

import {
	SERVICE,
	fetchProductCategories,
	fetchTaxClasses,
} from '../../wc-api-redux';

import {
	fetchProducts,
	setDisplayOption,
	initEdits,
	addProduct,
	editProduct,
	cancelEdits,
	saveEdits,
} from '../../state/products/actions';

// TODO: Do this in a more universal way.
const data = screenData( 'wc_synchrotron_data' );

class ProductList extends React.Component {
	propTypes: {
		products: PropTypes.object.isRequired,
		fetchProductCategories: PropTypes.func.isRequired,
		fetchTaxClasses: PropTypes.func.isRequired,
		fetchProducts: PropTypes.func.isRequired,
		setDisplayOption: PropTypes.func.isRequired,
		initEdits: PropTypes.func.isRequired,
		addProduct: PropTypes.func.isRequired,
		editProduct: PropTypes.func.isRequired,
		cancelEdit: PropTypes.func.isRequired,
		saveEdits: PropTypes.func.isRequired,
		currencySymbol: PropTypes.string.isRequired,
		currencyIsPrefix: PropTypes.bool.isRequired,
		currencyDecimals: PropTypes.number.isRequired,
	}

	constructor( props ) {
		super( props );

		this.renderViewTitle = this.renderViewTitle.bind( this );
		this.renderEditTitle = this.renderEditTitle.bind( this );
	}

	componentDidMount() {
		this.props.fetchProductCategories();
		this.props.fetchTaxClasses();

		// TODO: Fetch this through wc-api-redux
		this.props.fetchProducts( data.endpoints.products, data.nonce );
	}

	componentWillReceiveProps( nextProps ) {
		// TODO: Figure out a way to put this into a Higher Order Component.
		setFetchProps( nextProps );
	}

	render() {
		const __ = this.props.translate;
		const { products, categories, taxClasses, setDisplayOption, editProduct } = this.props;
		const { currencySymbol, currencyIsPrefix, currencyDecimals } = this.props;
		const { edits, saving } = products;

		return (
			<div className="product-list">
				<div className="product-list__header">
					{ edits ? this.renderEditTitle() : this.renderViewTitle() }
				</div>
				<ProductsBody
					products={ products.products }
					categories={ categories }
					taxClasses={ taxClasses }
					edits={ edits }
					editable={ edits }
					disabled={ Boolean( saving ) }
					display={ products.display }
					setDisplayOption={ setDisplayOption }
					editProduct={ editProduct }
					currencySymbol={ currencySymbol }
					currencyIsPrefix={ currencyIsPrefix }
					currencyDecimals={ currencyDecimals }
				/>
			</div>
		);
	}

	renderViewTitle() {
		const __ = this.props.translate;
		const { initEdits, addProduct } = this.props;

		return (
			<TitleBar icon="product" title={ __( 'Products' ) }>
				<Button onClick={ initEdits } >{ __( 'Edit products' ) }</Button>
				<Button primary onClick={ addProduct } >{ __( 'Add product' ) }</Button>
			</TitleBar>
		);
	}

	renderEditTitle() {
		const __ = this.props.translate;
		const { cancelEdits, saveEdits } = this.props;
		const { edits, saving } = this.props.products;

		return (
			<TitleBar icon="product" title={ __( 'Products' ) }>
				<Button onClick={ cancelEdits } >{ __( 'Cancel' ) }</Button>
				<Button
					primary
					onClick={ ( e ) => saveEdits( edits ) }
					disabled={ saving || 0 === Object.keys(edits).length }
				>
					{ ( saving ? __( 'Saving' ) : __( 'Save' ) ) }
				</Button>
			</TitleBar>
		);
	}
}

// TODO: Move this into a Higher Order Component.
let fetchProps = {};

function setFetchProps( props ) {
	fetchProps = {
		categories: wcApi.categories(), // Could be a query here based on other props.
		taxClasses: wcApi.taxClasses(), // Could be a query here based on other props.
	};
}

function mapStateToProps( state ) {
	const { products, fetchData } = state;

	return {
		...getFetchProps( fetchProps, state ),
		products,
	};
}

function mapDispatchToProps( dispatch ) {
	return bindActionCreators(
		{
			fetchProductCategories,
			fetchTaxClasses,
			fetchProducts,
			setDisplayOption,
			initEdits,
			addProduct,
			editProduct,
			cancelEdits,
			saveEdits,
		},
		dispatch
	);
}

export default connect( mapStateToProps, mapDispatchToProps )( localize( ProductList ) );

