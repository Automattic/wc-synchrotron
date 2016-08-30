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

	render() {
		const __ = this.props.translate;
		const { context, isVisible, columns, selectedColumns } = this.props;

		if ( isVisible ) {
			return (
					<PopoverMenu
						context={ context }
						isVisible={ isVisible }
						onClose={ () => { /* do nothing */ } }
						className="component__popover column-menu__popover"
						rootClassName="uses-s9n-styles"
						position="left"
					>
						<ul className='column-menu__list' >
							{ this.renderGroups( columns, selectedColumns ) }
						</ul>
					</PopoverMenu>
			);
		} else {
			return null;
		}
	}

	renderGroups( columns, selectedColumns ) {
		const groups = new Set( columns.map( ( col ) => col.group ) );
		let elements = [];

		groups.forEach( ( group ) => {
			if ( group ) {
				const groupColumns = columns.filter( ( col ) => { return group === col.group; } );

				elements.push(
					<li key={ group } className='column-menu__row' >
						<div className='column-menu__group-label column-menu__group-item'>{ group }</div>
						{ groupColumns.map( ( col ) => this.renderButton( col, selectedColumns ) ) }
					</li>
				);
			}
		} );

		return elements;
	}

	renderButton( column, selectedColumns ) {
		const selected = ( selectedColumns.has( column.key ) );
		const className = 'column-menu__group-item column-menu__button ' + ( selected ? 'selected' : 'unselected' );
		const onClick = ( evt ) => {
			evt.preventDefault();
			this.props.onColumnSelect( column.key, ! selected );
		};

		return <Button key={ column.title } className={ className } onClick={ onClick } >{ column.title }</Button>
	}
}

export default localize( ColumnMenu );
