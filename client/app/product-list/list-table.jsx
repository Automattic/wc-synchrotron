import React, { PropTypes } from 'react';
import ListHeader from './list-header';
import ListRow from './list-row';
import Card from 'components/card';

export default class ListTable extends React.Component {
	propTypes: {
		products: PropTypes.object.isRequired,
		columns: PropTypes.array.isRequired,
		selectedColumns: PropTypes.array.isRequired,
		editable: PropTypes.bool.isRequired,
	}

	constructor( props ) {
		super( props );
	}

	getListHeaderRef() {
		return this.refs && this.refs.listHeader;
	}

	render() {
		const { products, editable } = this.props;

		// Filter out all unselected columns.
		const columns = this.props.columns.filter( ( col ) => this.props.selectedColumns.has( col.key ) );

		const classes = 'product-list__list-table product-list__list-table-columns-' + columns.length;

		return (
			<Card className={ classes }>
				<ul className="product-list__list">
					<ListHeader ref="listHeader" columns={ columns } />
					{ products.map( ( data ) => this.renderRow( data, columns, editable ) ) }
				</ul>
			</Card>
		);
	}

	renderRow( data, columns, editable ) {
		return <ListRow key={ data.id } columns={ columns } data={ data } editable={ editable } />;
	}
}

