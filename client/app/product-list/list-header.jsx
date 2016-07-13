import React, { PropTypes } from 'react';

export default class ListHeader extends React.Component {
	propTypes: {
		columns: PropTypes.array.isRequired
	}

	constructor( props ) {
		super( props );
	}

	render() {
		const { columns } = this.props;

		return (
			<li className="product-list__list-header">
				{ columns.map( this.renderTitle ) }
			</li>
		);
	}

	renderTitle( col ) {
		return <span className="product-list__list-cell" key={ col.title }> { col.title } </span>;
	}
}
