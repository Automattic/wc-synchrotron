import React, { PropTypes } from 'react';
import { localize } from 'i18n-calypso';
import SectionNav from 'components/section-nav';
import NavTabs from 'components/section-nav/tabs';
import NavItem from 'components/section-nav/item';
import Gridicon from 'gridicons/react/gridicon';

class Sections extends React.Component {
	propTypes: {
		translate: PropTypes.func.isRequired
	}

	constructor( props ) {
		super( props );
	}

	render() {
		const __ = this.props.translate;

		return (
			<SectionNav>
				<NavTabs>
					<NavItem>{ __( 'All Coupons' ) }</NavItem>
					<NavItem>{ __( 'Active' ) }</NavItem>
					<NavItem>{ __( 'Scheduled' ) }</NavItem>
					<NavItem>{ __( 'Expired' ) }</NavItem>
				</NavTabs>
			</SectionNav>
		);
	}
}

export default localize( Sections );

