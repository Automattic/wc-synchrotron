import React, { PropTypes } from 'react';

export default class ListRow extends React.Component {
	propTypes: {
		columns: PropTypes.array.isRequired,
		data: PropTypes.object.isRequired
	}

	constructor( props ) {
		super( props );

		this.renderField = this.renderField.bind( this );
	}

	render() {
		const { columns } = this.props;

		return (
			<li className="product-list__list-row">
				{ columns.map( this.renderField ) }
				<span className="product-list__list-cell"> row </span>
			</li>
		);
	}

	renderField( col ) {
		const { data } = this.props;

		return (
			<span className="product-list__list-cell" key={ col.title }>
				{ col.func( data ) }
			</span>
		);
	}
}

