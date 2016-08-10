import React, { PropTypes } from 'react';
import { localize } from 'i18n-calypso';
import Gridicon from 'components/gridicon';
import SearchCard from 'components/search-card';
import Popover from 'components/popover';
import PopoverMenu from 'components/popover/menu';
import PopoverMenuItem from 'components/popover/menu-item';
import ListTable from './list-table';

class Body extends React.Component {
	propTypes: {
		products: PropTypes.object.isRequired,
		display: PropTypes.object.isRequired,
		setDisplayOption: PropTypes.func.isRequired,
	}

	constructor( props ) {
		super( props );

		const __ = this.props.translate;

		this.renderColumnSelectIcon = this.renderColumnSelectIcon.bind( this );
		this.onColumnSelectIconClick = this.onColumnSelectIconClick.bind( this );
		this.onCloseColumnSelect = this.onCloseColumnSelect.bind( this );

		this.columns = [
			{ key: 'name', title: __( 'Name' ), func: ( product ) => product.name },
			{ key: 'price', title: __( 'Price' ), func: ( product ) => product.regular_price },
			{ key: 'stock', title: __( 'Stock' ), func: ( product ) => product.stock_quantity },
			{ key: 'action', title: this.renderColumnSelectIcon(), func: ( product ) => null },
		];
	}

	onColumnSelectIconClick( evt ) {
		const { display, setDisplayOption } = this.props;

		// Toggle the display state of the column select.
		setDisplayOption( 'showColumnPanel', ! display.showColumnPanel );
	}

	onCloseColumnSelect( evt ) {
		this.props.setDisplayOption( 'showColumnPanel', false );
	}

	render() {
		const { products, display } = this.props;
		const onSearch = () => {}; // TODO: hook up to search/filter action.

		const popoverContext = this.refs.listTable && this.refs.listTable.refs.listHeader.refs.columnSelectIcon;

		return (
			<div className="product-list__body">
				<SearchCard onSearch={ onSearch } />
				<ListTable ref="listTable" products={ products } columns={ this.columns } />
				<Popover
					context={ popoverContext }
					isVisible={ display.showColumnPanel }
					onClose={ this.onCloseColumnSelect }
					className='popover uses-s9n-styles product-list__column-select'
					position="left"
				>
					This is a popover!
				</Popover>
			</div>
		);
	}

	renderColumnSelectIcon() {
		const __ = this.props.translate;
		const { display } = this.props;

		return (
			<span>
				<button ref="columnSelectIcon" onClick={ this.onColumnSelectIconClick } >
					<Gridicon icon="grid" />
				</button>
			</span>
		);
	}
}

export default localize( Body );

