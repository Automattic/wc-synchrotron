import React, { PropTypes } from 'react';
import classNames from 'classnames';

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
			</li>
		);
	}

	renderField( col ) {
		const { data } = this.props;
		const classes = classNames( 'product-list__list-cell', 'product-list__list-cell-' + col.key );

		return (
			<span className={ classes } key={ col.title }>
				{ col.func( data ) }
			</span>
		);
	}
}

