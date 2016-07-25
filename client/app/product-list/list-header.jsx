import React, { PropTypes } from 'react';
import classNames from 'classnames';

export default class ListHeader extends React.Component {
	propTypes: {
		columns: PropTypes.array.isRequired,
	}

	constructor( props ) {
		super( props );
	}

	render() {
		const { columns } = this.props;

		return (
			<li className="product-list__list-row product-list__list-row-header">
				{ columns.map( this.renderTitle ) }
			</li>
		);
	}

	renderTitle( col ) {
		const classes = classNames( 'product-list__list-cell', 'product-list__list-cell-' + col.key );

		return <span className={ classes } key={ col.title }>{ col.title }</span>;
	}
}
