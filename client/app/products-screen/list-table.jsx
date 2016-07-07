import React, { PropTypes } from 'react';
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
			<Card className="products__list-table">
				<span>List table!</span>
			</Card>
		);
	}
}

