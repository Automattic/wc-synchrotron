import React, { PropTypes } from 'react';
import CouponsListRow from './coupons-list-row';

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
							return <CouponsListRow coupon={ coupon } key={ coupon.id } />;
						} )
					}
				</tbody>
			</table>
		);
	}
}

