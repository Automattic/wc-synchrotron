import React, { PropTypes } from 'react';
import CouponCard from './coupon-card';
import CouponEditCard from './coupon-edit-card';

export default class CouponsList extends React.Component {
	propTypes: {
		coupons: PropTypes.array.isRequired,
		editing: PropTypes.object,
		onCouponEdit: PropTypes.func,
		onCouponCancel: PropTypes.func,
		onCouponSave: PropTypes.func,
	}

	render() {
		const { coupons, editing } = this.props;
		const { onCouponEdit, onCouponCancel, onCouponSave } = this.props;

		return (
			<div>
				{
					coupons.map( ( coupon ) => {
						if ( coupon.id in editing ) {
							return <CouponEditCard
								coupon={ editing[coupon.id] }
								key={ coupon.id }
								onEdit={ onCouponEdit }
								onCancelClick={ onCouponCancel }
								onSaveClick={ onCouponSave } />;

						} else {
							return <CouponCard
								coupon={ coupon }
								key={ coupon.id }
								onEditClick={ onCouponEdit } />;
						}
					} )
				}
			</div>
		);
	}
}

