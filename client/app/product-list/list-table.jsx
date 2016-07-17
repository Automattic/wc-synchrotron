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
		const { columns, products } = this.props;

		return (
			<Card className="product-list__list-table" >
				<ul className="product-list__list" >
					<ListHeader columns={ columns } />
					{
						products.map( ( data ) => {
							return this.renderRow( data, columns );
						} )
					}
				</ul>
			</Card>
		);
	}

	renderRow( data, columns ) {
		return <ListRow columns={ columns } data={ data } />;
	}
}

