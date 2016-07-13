import React, { PropTypes } from 'react';
import ListHeader from './list-header';
import ListRow from './list-row';
import Card from 'components/card';

export default class ListTable extends React.Component {
	propTypes: {
		products: PropTypes.object.isRequired,
		columns: PropTypes.object.isRequired,
	}

	constructor( props ) {
		super( props );
	}

	render() {
		const { columns } = this.props;

		return (
			<Card className="product-list__list-table" >
				<ul className="product-list__list" >
					<ListHeader columns={ columns } />
					<ListRow columns={ columns } data={ { name: 'Product 1', regular_price: 1.99, stock_quantity: 1 } } />
					<ListRow columns={ columns } data={ { name: 'Product 2', regular_price: 2.99, stock_quantity: 20 } } />
					<ListRow columns={ columns } data={ { name: 'Product 3', regular_price: 3.99, stock_quantity: 300 } } />
				</ul>
			</Card>
		);
	}
}

