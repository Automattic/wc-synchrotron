import React, { PropTypes } from 'react';
import { localize } from 'i18n-calypso';
import Button from 'components/button';
import PopoverMenu from 'components/popover/menu';
import PopoverMenuItem from 'components/popover/menu-item';

class ColumnMenu extends React.Component {
	propTypes: {
		context: PropTypes.object.isRequired,
		isVisible: PropTypes.bool.isRequired,
		columns: PropTypes.array.isRequired,
		columnGroups: PropTypes.array.isRequired,
		selectedColumnKeys: PropTypes.set.isRequired,
		onColumnSelect: PropTypes.func.isRequired,
	}

	render() {
		const __ = this.props.translate;
		const { context, isVisible, columns, columnGroups, selectedColumnKeys } = this.props;

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
							{ this.renderGroups( columns, columnGroups, selectedColumnKeys ) }
						</ul>
					</PopoverMenu>
			);
		} else {
			return null;
		}
	}

	renderGroups( columns, columnGroups, selectedColumnKeys ) {
		const groups = new Set( columns.map( ( col ) => col.group ) );
		let elements = [];

		columnGroups.forEach( ( group ) => {
			console.log( 'group: ' + group.name );
			elements.push(
				<li key={ group.name } className='column-menu__row' >
					<div className='column-menu__group-label column-menu__group-item'>{ group.name }</div>
					{
						group.columns.map( ( colName ) => {
							// TODO: Consider making columns an object with keys instead of an array.
							const column = columns.find( ( c ) => colName === c.key );
							return this.renderButton( column, selectedColumnKeys )
						} )
					}
				</li>
			);
		} );

		return elements;
	}

	renderButton( column, selectedColumnKeys ) {
		const selected = ( selectedColumnKeys.has( column.key ) );
		const className = 'column-menu__group-item column-menu__button ' + ( selected ? 'selected' : 'unselected' );
		const onClick = ( evt ) => {
			evt.preventDefault();
			this.props.onColumnSelect( column.key, ! selected );
		};

		return <Button key={ column.title } className={ className } onClick={ onClick } >{ column.title }</Button>
	}
}

export default localize( ColumnMenu );
