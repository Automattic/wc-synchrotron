import React, { PropTypes } from 'react';
import { translate as __ } from 'lib/mixins/i18n';
import TitleBar from '../title-bar';
import AddCoupon from './add-coupon';

export default class ScreenHeader extends React.Component {
	propTypes: {
		onAddCoupon: PropTypes.func.isRequired
	}

	constructor( props ) {
		super( props );
	}

	render() {
		return (
			<div className="screen-header">
				<TitleBar title={ __( 'Coupons' ) } tagLine={ this.renderTagLine() }>
					<AddCoupon onAddCoupon={ this.props.onAddCoupon } />
				</TitleBar>
			</div>
		);
	}

	renderTagLine() {
		return (
			<span>
				{ __( 'A great way to offer discounts and rewards to your customers, and can help promote sales across your shop.' ) }
				&nbsp;
				<a href='https://docs.woothemes.com/document/coupon-management/'>{ __( 'Learn more' ) }</a>
			</span>
		);
	}
}

