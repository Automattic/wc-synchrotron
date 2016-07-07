import React, { PropTypes } from 'react';

export default class ListRow extends React.Component {
	propTypes: {
		product: PropTypes.object.isRequired
	}

	constructor( props ) {
		super( props );
	}

	render() {
		return (
			<li className="products-screen__list-row">
				<span className="products-screen__list-cell"> row </span>
			</li>
		);
	}
}

