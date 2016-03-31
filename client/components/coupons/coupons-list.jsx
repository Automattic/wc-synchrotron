import React, { PropTypes } from 'react';
import CouponsListRow from './coupons-list-row';

export default class CouponsList extends React.Component {
	propTypes: {
		coupons: PropTypes.array.isRequired
	}

	render() {
		const { coupons } = this.props;

		return (
			<div>
				{
					coupons.map( ( coupon ) => {
						return <CouponsListRow coupon={ coupon } key={ coupon.id } />;
					} )
				}
			</div>
		);
	}
}

