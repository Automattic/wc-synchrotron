import React, { PropTypes } from 'react';
import { localize } from 'i18n-calypso';

class TopMenu extends React.Component {
	propTypes: {
		translate: PropTypes.func.isRequired,
		coupons: PropTypes.object
	}

	constructor( props ) {
		super( props );
	}

	render() {
		const __ = this.props.translate;

		return (
			<div className="top-menu">
				<ul>
					<li> { __( 'All Coupons' ) } </li>
					<li> { __( 'Active' ) } </li>
					<li> { __( 'Scheduled' ) } </li>
					<li> { __( 'Expired' ) } </li>
				</ul>
			</div>
		);
	}
}

export default localize( TopMenu );

