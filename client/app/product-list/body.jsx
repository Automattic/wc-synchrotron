import React, { PropTypes } from 'react';
import { localize } from 'i18n-calypso';
import SearchCard from 'components/search-card';
import ListTable from './list-table';
import * as cell from './cell-render';
import columns from './columns';

class ListBody extends React.Component {
	propTypes: {
		products: PropTypes.object.isRequired,
		editable: PropTypes.bool.isRequired,
		display: PropTypes.object.isRequired,
		setDisplayOption: PropTypes.func.isRequired,
	}

	constructor( props ) {
		super( props );

		this.onColumnSelectIconClick = this.onColumnSelectIconClick.bind( this );
		this.onColumnSelect = this.onColumnSelect.bind( this );
	}

	onColumnSelectIconClick( evt ) {
		evt.preventDefault();

		const { display, setDisplayOption } = this.props;

		// Toggle the display state of the column select.
		setDisplayOption( 'showColumnPanel', ! display.showColumnPanel );
	}

	onColumnSelect( key, selected ) {
		const prevKeys = this.props.display.selectedColumnKeys;

		let keys = new Set( prevKeys );

		if ( selected ) {
			keys.add( key );
		} else {
			keys.delete( key );
		}

		this.props.setDisplayOption( 'selectedColumnKeys', keys );
	}

	render() {
		const { products, editable, display } = this.props;
		const onSearch = () => {}; // TODO: hook up to search/filter action.

		return (
			<div className="product-list__body">
				<SearchCard onSearch={ onSearch } />
				<ListTable
					ref="listTable"
					products={ products }
					display={ display }
					editable={ editable }
					columns={ columns }
					selectedColumnKeys={ display.selectedColumnKeys }
					onColumnSelectIconClick={ this.onColumnSelectIconClick }
					onColumnSelect={ this.onColumnSelect}
				/>
			</div>
		);
	}
}

export default localize( ListBody );

