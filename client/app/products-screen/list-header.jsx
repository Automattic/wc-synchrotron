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
			<li className="products-screen__list-header">
				<span className="products-screen__list-cell"> header </span>
			</li>
		);
	}
}
