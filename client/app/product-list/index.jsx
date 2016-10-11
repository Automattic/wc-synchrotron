import React, { PropTypes } from 'react';
import { localize } from 'i18n-calypso';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TitleBar from '../../components/title-bar';
import ProductsBody from './body';
import Button from 'components/button';
import screenData from '../../utils/screen-data';

import {
	SERVICE,
	fetchProductCategories,
} from '../../wc-api-redux';

import {
	getData,
} from '../../state/fetch-data/actions';

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
		// TODO: Fetch this through wc-api-redux
		this.props.fetchProductCategories();
		this.props.fetchProducts( data.endpoints.products, data.nonce );
	}

	render() {
		const __ = this.props.translate;
		const { products, setDisplayOption, editProduct } = this.props;
		const { currencySymbol, currencyIsPrefix, currencyDecimals } = this.props;
		const { edits, saving } = products;

		return (
			<div className="product-list">
				<div className="product-list__header">
					{ edits ? this.renderEditTitle() : this.renderViewTitle() }
				</div>
				<ProductsBody
					products={ products.products }
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

function mapStateToProps( state ) {
	const { products } = state;

	return {
		products,
	};
}

function mapDispatchToProps( dispatch ) {
	return bindActionCreators(
		{
			fetchApiData: ( query ) => getData( SERVICE, query, dispatch.getState()[ 'fetch-data' ] ),
			fetchProductCategories,
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
