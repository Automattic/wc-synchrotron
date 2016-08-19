import React, { PropTypes } from 'react';
import { localize } from 'i18n-calypso';
import Button from 'components/button';
import Gridicon from 'components/gridicon';
import SearchCard from 'components/search-card';
import Popover from 'components/popover';
import PopoverMenu from 'components/popover/menu';
import PopoverMenuItem from 'components/popover/menu-item';
import ListTable from './list-table';

class ListBody extends React.Component {
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
			{ key: 'action', title: this.renderColumnSelectIcon, func: ( product ) => null },
		];
	}

	onColumnSelectIconClick( evt ) {
		evt.preventDefault();

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

		// TODO: Show column selection panel.
		if ( display.showColumnPanel ) {
			console.log( 'Show column panel!' );
		}

		return (
			<div className="product-list__body">
				<SearchCard onSearch={ onSearch } />
				<ListTable ref="listTable" products={ products } columns={ this.columns } />
			</div>
		);
	}

	renderColumnSelectIcon() {
		const __ = this.props.translate;
		const { display } = this.props;

		// Drill down to the ref for the column select button (this will be null upon first render)
		const listTableRef = this.refs && this.refs.listTable;
		const headerRef = listTableRef && listTableRef.getListHeaderRef();
		const columnSelectRef = headerRef && headerRef.refs && headerRef.refs.columnSelect;

		console.log( columnSelectRef );
		console.log( this.refs );

		return (
			<Button borderless ref="columnSelect" onClick={ this.onColumnSelectIconClick }>
				<Gridicon icon="grid" />
				<PopoverMenu
					context={ columnSelectRef }
					isVisible={ display.showColumnPanel }
					onClose={ this.onCloseColumnSelect }
					className="component__popover"
					rootClassName="uses-s9n-styles"
					position="left"
				>
					<PopoverMenuItem action="A">Placeholder Menu Item A</PopoverMenuItem>
					<PopoverMenuItem action="B">Placeholder Menu Item B</PopoverMenuItem>
				</PopoverMenu>
			</Button>
		);
	}

	renderColumnSelectMenu() {
	}
}

export default localize( ListBody );

