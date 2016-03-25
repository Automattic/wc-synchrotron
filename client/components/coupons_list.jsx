import React, { PropTypes } from 'react';

export default class CouponsList extends React.Component {
	propTypes: {
		coupons: PropTypes.array.isRequired
	}

	render() {
		const { coupons } = this.props;

		return (
			<table className="wp-list-table widefat fixed striped posts">
				<thead>
					<tr>
						<th scope="col" id="coupon_code" className="manage-column column-coupon_code column-primary">Code</th>
						<th scope="col" id="type" className="manage-column column-type">Coupon type</th>
						<th scope="col" id="amount" className="manage-column column-amount">Coupon amount</th>
						<th scope="col" id="description" className="manage-column column-description">Description</th>
						<th scope="col" id="products" className="manage-column column-products">Product IDs</th>
						<th scope="col" id="usage" className="manage-column column-usage">Usage / Limit</th>
						<th scope="col" id="expiry_date" className="manage-column column-expiry_date">Expiry Date</th>
					</tr>
				</thead>
				<tbody id="the-list">
					{
						coupons.map( ( coupon ) => {
							return <CouponRow coupon={ coupon } key={ coupon.id } />;
						} )
					}
				</tbody>
			</table>
		);
	}
}

class CouponRow extends React.Component {
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

