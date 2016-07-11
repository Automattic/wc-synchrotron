import React, { PropTypes } from 'react';
import ListHeader from './list-header';
import ListRow from './list-row';
import Card from 'components/card';

export default class ListTable extends React.Component {
	propTypes: {
		products: PropTypes.object.isRequired
	}

	constructor( props ) {
		super( props );
	}

	render() {
		return (
			<Card className="product-list__list-table" >
				<ul className="product-list__list" >
					<ListHeader />
					<ListRow />
					<ListRow />
					<ListRow />
				</ul>
			</Card>
		);
	}
}

