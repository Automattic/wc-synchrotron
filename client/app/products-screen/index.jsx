import React, { PropTypes } from 'react';
import { localize } from 'i18n-calypso';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TitleBar from '../../components/title-bar';
import ListTable from './list-table';
import Button from 'components/button';

class ProductsScreen extends React.Component {
	propTypes: {
		products: PropTypes.object.isRequired
	}

	constructor( props ) {
		super( props );
	}

	render() {
		const __ = this.props.translate;
		const onEdit = null; // TODO: hook up to bound action creator
		const onAdd = null; // TODO: hook up to bound action creator
		const { products } = this.props;

		return (
			<div className="products__screen">
				<div className="products__screen-header">
					<TitleBar icon="product" title={ __( 'Products' ) }>
						<Button onClick={ onEdit } >{ __( 'Edit products' ) }</Button>
						<Button primary onClick={ onAdd } >{ __( 'Add product' ) }</Button>
					</TitleBar>
				</div>
				<ListTable products={ products } />
			</div>
		);
	}
}

function mapStateToProps( state ) {
	const { products } = state;

	return {
		// TODO: Add products to state.
	};
}

function mapDispatchToProps( dispatch ) {
	return bindActionCreators(
		{
			// TODO: Add actions
		},
		dispatch
	);
}

export default connect( mapStateToProps, mapDispatchToProps )( localize( ProductsScreen ) );
