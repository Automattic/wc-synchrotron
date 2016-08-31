import React, { PropTypes } from 'react';

export default class ListRow extends React.Component {
	propTypes: {
		columns: PropTypes.array.isRequired,
		data: PropTypes.object.isRequired,
		editable: PropTypes.bool.isRequired,
	}

	constructor( props ) {
		super( props );

		this.renderField = this.renderField.bind( this );
		this.renderFieldContents = this.renderFieldContents.bind( this );
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
		const classes = 'product-list__list-cell product-list__list-cell-' + col.key;

		return (
			<span className={ classes } key={ col.key }>
				{ this.renderFieldContents( col ) }
			</span>
		);
	}

	renderFieldContents( col ) {
		const { data, editable } = this.props;

		if ( editable && col.edit ) {
			return col.edit( data, col.key );
		} else if ( col.view ) {
			return col.view( data, col.key );
		} else {
			return null;
		}
	}
}

