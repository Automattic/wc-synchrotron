import React, { PropTypes } from 'react';

export default class CouponsListRow extends React.Component {
	propTypes: {
		coupon: PropTypes.object.isRequired
	}

	render() {
		const { coupon } = this.props;
		const trId = "trCoupon-" + coupon.id;

		return (
			<tr id={ trId } className="type-shop_coupon hentry">
				<td className="coupon_code column-coupon_code has-row-actions column-primary" data-colname="Code">
					<strong>
						<a className="row-title" href="#">{ coupon.code }</a>
					</strong>
				</td>
				<td className="type column-type" data-colname="Coupon type">
					{ coupon.type }
				</td>
				<td className="amount column-amount" data-colname="Coupon amount">
					{ coupon.amount }
				</td>
				<td className="amount column-description" data-colname="Description">
					{ coupon.description }
				</td>
				<td className="amount column-products" data-colname="Product IDs">
					{ coupon.amount }
				</td>
				<td className="amount column-usage" data-colname="Usage / Limit">
					{ coupon.product_ids.join( ' ' ) }
				</td>
				<td className="amount column-expiry_date" data-colname="Expiry Date">
					{ coupon.expiry_date }
				</td>

			</tr>
		);
	}
}

