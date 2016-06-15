import React, { PropTypes } from 'react';
import { translate as __ } from 'lib/mixins/i18n';
import SectionNav from 'components/section-nav';
import NavTabs from 'components/section-nav/tabs';
import NavItem from 'components/section-nav/item';
import Gridicon from 'gridicons/react/gridicon';

export default class Sections extends React.Component {
	propTypes: {
	}

	constructor( props ) {
		super( props );
	}

	render() {
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

