import React, { PropTypes } from 'react';
import Card from 'components/card';

export default class CouponsListRow extends React.Component {
	propTypes: {
		coupon: PropTypes.object.isRequired
	}

	render() {
		const { coupon } = this.props;
		const trId = "trCoupon-" + coupon.id;

		return (
			<Card href="#">
				<strong> { coupon.code } </strong>
				<p> { coupon.description } </p>
				<div>
					<span> Type: { coupon.type } </span> |
					<span> Amount: { coupon.amount } </span> |
					<span> Products: { coupon.product_ids.join( ' ' ) } </span> |
					<span> Expiry: { coupon.expiry_date } </span>
				</div>
			</Card>
		);
	}
}

