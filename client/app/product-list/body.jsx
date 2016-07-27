import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { localize } from 'i18n-calypso';
import Popover from 'components/react-popover';
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

		this.renderColumnSelectIcon = this.renderColumnSelectIcon.bind( this );
		this.onColumnSelectIconClick = this.onColumnSelectIconClick.bind( this );

		this.columns = [
			{ key: 'name', title: __( 'Name' ), func: ( product ) => product.name },
			{ key: 'price', title: __( 'Price' ), func: ( product ) => product.regular_price },
			{ key: 'stock', title: __( 'Stock' ), func: ( product ) => product.stock_quantity },
			{ key: 'action', title: this.renderColumnSelectIcon, func: ( product ) => null },
		];

		this.state = {
			popoverContext: null,
			popoverVisible: false,
		}
	}

	onColumnSelectIconClick( evt ) {
		evt.preventDefault();
		console.log( 'show/hide column select!' );

		this.setState( {
			popoverContext: evt.currentTarget,
			popoverVisible: ! this.state.popoverVisible,
		} );
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
		const { popoverContext, popoverVisible } = this.state;

		return (
			<a href='#' onClick={ this.onColumnSelectIconClick } >
				<Gridicon icon="grid" />

				<Popover context={ popoverContext } isVisible={ popoverVisible } >
					<h3>I am a popover.</h3>
				</Popover>
			</a>
		);
	}
}

export default localize( Body );

