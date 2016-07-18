import React, { PropTypes } from 'react';
import ListHeader from './list-header';
import ListRow from './list-row';
import Card from 'components/card';
import classNames from 'classnames';

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
		const classes = classNames( 'product-list__list-table', 'product-list__list-table-columns-' + columns.length );

		return (
			<Card className={ classes }>
				<ul className="product-list__list">
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

