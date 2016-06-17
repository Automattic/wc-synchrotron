import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { localize } from 'i18n-calypso';
import Gridicon from 'gridicons/react/gridicon';
import Sidebar from 'layout/sidebar';
import SidebarMenu from 'layout/sidebar/menu';
import SidebarHeading from 'layout/sidebar/heading';

class Nav extends React.Component {
	propTypes: {
		translate: PropTypes.func.isRequired
	}

	constructor( props ) {
		super( props );
	}

	render() {
		const __ = this.props.translate;

		return (
			<div id="navigation" className="wc-admin-navigation">
				<Sidebar>
					<SidebarMenu>
						<ul>
							<li> { this.renderLink( '/', 'house', __( 'Dashboard' ) ) } </li>
							<li> { this.renderLink( '/orders', 'pages', __( 'Orders' ) ) } </li>
							<li> { this.renderLink( '/reports', 'stats', __( 'Reports' ) ) } </li>
						</ul>
						<SidebarHeading>{ __( 'Manage' ) }</SidebarHeading>
						<ul>
							<li> { this.renderLink( '/products', 'product', __( 'Products' ) ) } </li>
							<li> { this.renderLink( '/attributes', 'list-unordered', __( 'Attributes' ) ) } </li>
							<li> { this.renderLink( '/categories', 'folder', __( 'Categories' ) ) } </li>
							<li> { this.renderLink( '/tags', 'tag', __( 'Tags' ) ) } </li>
							<li> { this.renderLink( '/coupons', 'coupon', __( 'Coupons' ) ) } </li>
						</ul>
						<SidebarHeading>{ __( 'Configure' ) }</SidebarHeading>
						<ul>
							<li> { this.renderLink( '/settings', 'cog', __( 'Settings' ) ) } </li>
							<li> { this.renderLink( '/display', 'computer', __( 'Display' ) ) } </li>
							<li> { this.renderLink( '/emails', 'mail', __( 'Emails' ) ) } </li>
						</ul>
						<ul className="checkout-gateways">
							<li> { this.renderLink( '/checkout', 'cart', __( 'Checkout' ) ) } </li>
							<li> { this.renderLink( '/gateways', 'credit-card', __( 'Payment Gateways' ) ) } </li>
						</ul>
						<ul className="tax">
							<li> { this.renderLink( '/taxes', 'money', __( 'Tax' ) ) } </li>
						</ul>
						<ul className="shipping">
							<li> { this.renderLink( '/shipping', 'shipping', __( 'Shipping' ) ) } </li>
						</ul>
						<ul className="integrations">
							<li> { this.renderLink( '/integrations', 'grid', __( 'Integrations' ) ) } </li>
						</ul>
					</SidebarMenu>
				</Sidebar>
			</div>
		);
	}

	renderLink( url, icon, text ) {
		const iconSize = 24;

		return (
			<Link to={ url }>
				<Gridicon icon={ icon } size={ iconSize } />
				<span className="menu-link-text">{ text }</span>
			</Link>
		);
	}
}

export default localize( Nav );

