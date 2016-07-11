import React, { PropTypes } from 'react';

export default class ListHeader extends React.Component {
	propTypes: {
		columns: PropTypes.array.isRequired
	}

	constructor( props ) {
		super( props );
	}

	render() {
		return (
			<li className="product-list__list-header">
				<span className="product-list__list-cell"> header </span>
			</li>
		);
	}
}
