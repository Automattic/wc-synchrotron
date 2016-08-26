import React, { PropTypes } from 'react';
import { localize } from 'i18n-calypso';
import Button from 'components/button';
import PopoverMenu from 'components/popover/menu';
import PopoverMenuItem from 'components/popover/menu-item';

class ColumnMenu extends React.Component {
	propTypes: {
		context: PropTypes.object.isRequired,
		isVisible: PropTypes.bool.isRequired,
		columns: PropTypes.func.isRequired,
		selectedColumns: PropTypes.array.isRequired,
		onColumnSelect: PropTypes.func.isRequired,
	}

	constructor( props ) {
		super( props );

		this.setColumnSelected = this.setColumnSelected.bind( this );
	}

	setColumnSelected( key, selected ) {
	}

	render() {
		const __ = this.props.translate;
		const { context, isVisible, columns, selectedColumns } = this.props;

		return (
				<PopoverMenu
					context={ context }
					isVisible={ isVisible }
					onClose={ () => { /* do nothing */ } }
					className="component__popover column-menu__popover"
					rootClassName="uses-s9n-styles"
					position="left"
				>
					<ul>
						{ this.renderGroups( columns, selectedColumns ) }
					</ul>
				</PopoverMenu>
		);
	}

	renderGroups( columns, selectedColumns ) {
		const groups = new Set( columns.map( ( col ) => col.group ) );
		let elements = [];

		groups.forEach( ( group ) => {
			if ( group ) {
				const groupColumns = columns.filter( ( col ) => { return group === col.group; } );

				elements.push(
					<li>
						<p>{ group }</p>
						{ groupColumns.map( ( col ) => this.renderButton( col, selectedColumns ) ) }
					</li>
				);
			}
		} );

		return elements;
	}

	renderButton( column, selectedColumns ) {
		const selected = ( selectedColumns.has( column.key ) );
		const className = 'column-menu__button:' + ( selected ? 'selected' : 'unselected' );
		const onClick = ( evt ) => {
			evt.preventDefault();
			this.props.onColumnSelect( column.key, ! selected );
		};

		return <Button className={ className } onClick={ onClick } >{ column.title }</Button>
	}
}

export default localize( ColumnMenu );
