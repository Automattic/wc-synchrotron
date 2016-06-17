import React, { PropTypes } from 'react';
import { localize } from 'i18n-calypso';
import TitleBar from '../title-bar';
import AddCoupon from './add-coupon';
import Sections from './sections';

class ScreenHeader extends React.Component {
	propTypes: {
		translate: PropTypes.func.isRequired,
		onAddCoupon: PropTypes.func.isRequired
	}

	constructor( props ) {
		super( props );
	}

	render() {
		const __ = this.props.translate;

		return (
			<div className="screen-header">
				<TitleBar title={ __( 'Coupons' ) } tagLine={ this.renderTagLine() }>
					<AddCoupon onAddCoupon={ this.props.onAddCoupon } />
				</TitleBar>
				<Sections/>
			</div>
		);
	}

	renderTagLine() {
		const __ = this.props.translate;

		return (
			<span>
				{ __( 'A great way to offer discounts and rewards to your customers, and can help promote sales across your shop.' ) }
				&nbsp;
				<a href='https://docs.woothemes.com/document/coupon-management/'>{ __( 'Learn more' ) }</a>
			</span>
		);
	}
}

export default localize( ScreenHeader );

