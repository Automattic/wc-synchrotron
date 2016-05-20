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

	constructor( props ) {
		super( props );

		this.renderCard = this.renderCard.bind( this );
	}

	render() {
		const { coupons } = this.props;

		return (
			<div>
				{ coupons.map( this.renderCard ) }
			</div>
		);
	}

	renderCard( coupon ) {
		const { editing } = this.props;
		const { onCouponEdit, onCouponCancel, onCouponSave } = this.props;
		let card;

		if ( coupon.id in editing ) {
			card = <CouponEditCard
				coupon={ editing[coupon.id] }
				key={ coupon.id }
				onEdit={ onCouponEdit }
				onCancelClick={ onCouponCancel }
				onSaveClick={ onCouponSave } />;
		} else {
			card = <CouponCard
				coupon={ coupon }
				key={ coupon.id }
				onEditClick={ onCouponEdit } />;
		}

		return card;
	}
}

