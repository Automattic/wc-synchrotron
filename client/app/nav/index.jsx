import React, { PropTypes } from 'react';
import { translate as __ } from 'lib/mixins/i18n';
import Sidebar from 'layout/sidebar';
import SidebarMenu from 'layout/sidebar/menu';
import SidebarHeading from 'layout/sidebar/heading';

export default class Nav extends React.Component {
	constructor( props ) {
		super( props );
	}

	render() {
		return (
			<Sidebar>
				<SidebarMenu>
					<SidebarHeading>{ __( 'Manage' ) }</SidebarHeading>
					<SidebarHeading>{ __( 'Configure' ) }</SidebarHeading>
				</SidebarMenu>
			</Sidebar>
		);
	}
}

