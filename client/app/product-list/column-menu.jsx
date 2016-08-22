import React, { PropTypes } from 'react';

import PopoverMenu from 'components/popover/menu';
import PopoverMenuItem from 'components/popover/menu-item';

export default class ColumnMenu extends React.Component {
	propTypes: {
		context: PropTypes.object.isRequired,
		isVisible: PropTypes.bool.isRequired,
		onClose: PropTypes.func.isRequired,
	}

	render() {
		const { context, isVisible, onClose } = this.props;

		return (
				<PopoverMenu
					context={ context }
					isVisible={ isVisible }
					onClose={ onClose }
					className="component__popover column-menu__popover"
					rootClassName="uses-s9n-styles"
					position="left"
				>
					<PopoverMenuItem action="A">Placeholder Menu Item A</PopoverMenuItem>
					<PopoverMenuItem action="B">Placeholder Menu Item B</PopoverMenuItem>
					<PopoverMenuItem action="C">Placeholder Menu Item C</PopoverMenuItem>
				</PopoverMenu>
		);
	}
}
