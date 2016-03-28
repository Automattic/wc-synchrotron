import React, { PropTypes } from 'react';
import CouponCard from './coupon-card';

export default class CouponsList extends React.Component {
	propTypes: {
		coupons: PropTypes.array.isRequired
	}

	constructor( props ) {
		super( props );

		this.handleCouponEditClick = this.handleCouponEditClick.bind( this );
	}

	handleCouponEditClick( e ) {
		console.log( "handleCouponEditClick" );
		console.log( e );
	}

	render() {
		const { coupons } = this.props;

		return (
			<div>
				{
					coupons.map( ( coupon ) => {
						return <CouponCard coupon={ coupon } key={ coupon.id } onEditClick={ this.handleCouponEditClick } />;
					} )
				}
			</div>
		);
	}
}

