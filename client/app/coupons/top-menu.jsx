import React, { PropTypes } from 'react';
import { translate as __ } from 'lib/mixins/i18n';

export default class TopMenu extends React.Component {
	propTypes: {
		coupons: PropTypes.object
	}

	constructor( props ) {
		super( props );
	}

	render() {
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

