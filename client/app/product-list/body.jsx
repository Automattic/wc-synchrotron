import React, { PropTypes } from 'react';
import { localize } from 'i18n-calypso';
import SearchCard from 'components/search-card';
import ListTable from './list-table';

class Body extends React.Component {
	propTypes: {
		products: PropTypes.object.isRequired,
	}

	constructor( props ) {
		super( props );

		const __ = this.props.translate;

		this.columns = [
			{ key: 'name', title: __( 'Name' ), func: ( product ) => product.name },
			{ key: 'price', title: __( 'Price' ), func: ( product ) => product.regular_price },
			{ key: 'stock', title: __( 'Stock' ), func: ( product ) => product.stock_quantity },
		];
	}

	render() {
		const { products } = this.props;
		const onSearch = () => {}; // TODO: hook up to search/filter action.

		return (
			<div className="product-list__body">
				<SearchCard onSearch={ onSearch } />
				<ListTable products={ products } columns={ this.columns } />
			</div>
		);
	}
}

export default localize( Body );

