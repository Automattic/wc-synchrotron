import React, { PropTypes } from 'react';
import { localize } from 'i18n-calypso';
import Gridicon from 'components/gridicon';
import SearchCard from 'components/search-card';
import ListTable from './list-table';

class Body extends React.Component {
	propTypes: {
		products: PropTypes.object.isRequired,
	}

	constructor( props ) {
		super( props );

		const __ = this.props.translate;

		this.columns = [
			{ key: 'name', title: __( 'Name' ), func: ( product ) => product.name },
			{ key: 'price', title: __( 'Price' ), func: ( product ) => product.regular_price },
			{ key: 'stock', title: __( 'Stock' ), func: ( product ) => product.stock_quantity },
			{ key: 'action', title: this.renderColumnSelectIcon(), func: ( product ) => null },
		];

		this.renderColumnSelectIcon = this.renderColumnSelectIcon.bind( this );
		this.onColumnSelectIconClick = this.onColumnSelectIconClick.bind( this );
	}

	onColumnSelectIconClick( evt ) {
		evt.preventDefault();
		// TODO: Show column selection panel.
		console.log( 'show/hide column select!' );
	}

	render() {
		const { products } = this.props;
		const onSearch = () => {}; // TODO: hook up to search/filter action.

		return (
			<div className="product-list__body">
				<SearchCard onSearch={ onSearch } />
				<ListTable products={ products } columns={ this.columns } />
			</div>
		);
	}

	renderColumnSelectIcon() {
		const __ = this.props.translate;

		return (
			<a href='#' onClick={ this.onColumnSelectIconClick } >
				<Gridicon icon="grid" />
			</a>
		);
	}
}

export default localize( Body );

