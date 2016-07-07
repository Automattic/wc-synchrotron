import React, { PropTypes } from 'react';
import SearchCard from 'components/search-card';
import ListTable from './list-table';

export default class ProductsBody extends React.Component {
	propTypes: {
		products: PropTypes.object.isRequired
	}

	constructor( props ) {
		super( props );
	}

	render() {
		const { products } = this.props;
		const onSearch = () => {}; // TODO: hook up to search/filter action.

		return (
			<div className="products-screen__body">
				<SearchCard onSearch={ onSearch } />
				<ListTable products={ products } />
			</div>
		);
	}
}

