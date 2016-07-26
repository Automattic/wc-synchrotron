import React, { PropTypes } from 'react';
import { localize } from 'i18n-calypso';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchProducts } from '../../state/products/actions';
import TitleBar from '../../components/title-bar';
import ProductsBody from './body';
import Button from 'components/button';
import screenData from '../../utils/screen-data';

// TODO: Do this in a more universal way.
const data = screenData( 'wc_synchrotron_data' );

class ProductList extends React.Component {
	propTypes: {
		products: PropTypes.object.isRequired,
	}

	constructor( props ) {
		super( props );
	}

	componentDidMount() {
		this.props.fetchProducts( data.endpoints.products, data.nonce );
	}

	render() {
		const __ = this.props.translate;
		const onEdit = null; // TODO: hook up to bound action creator
		const onAdd = null; // TODO: hook up to bound action creator
		const { products } = this.props;

		return (
			<div className="product-list">
				<div className="product-list__header">
					<TitleBar icon="product" title={ __( 'Products' ) }>
						<Button onClick={ onEdit } >{ __( 'Edit products' ) }</Button>
						<Button primary onClick={ onAdd } >{ __( 'Add product' ) }</Button>
					</TitleBar>
				</div>
				<ProductsBody products={ products.products } />
			</div>
		);
	}
}

function mapStateToProps( state ) {
	const { products } = state;

	return {
		products
	};
}

function mapDispatchToProps( dispatch ) {
	return bindActionCreators(
		{
			fetchProducts,
		},
		dispatch
	);
}

export default connect( mapStateToProps, mapDispatchToProps )( localize( ProductList ) );
