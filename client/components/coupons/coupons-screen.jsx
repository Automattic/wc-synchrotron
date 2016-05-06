import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchCoupons, editCoupon, cancelCouponEdit } from '../../state/coupons/actions';
import CouponsList from './coupons-list';

class CouponsScreen extends React.Component {
	constructor( props ) {
		super( props );
	}

	componentDidMount() {
		const { data } = this.props;

		this.props.fetchCoupons( data.endpoints.get_coupons, data.nonce );
	}

	render() {
		return (
			<div className="wrap">
				{ this.renderCouponsList( this.props.coupons ) }
			</div>
		);
	}

	renderCouponsList( couponsState ) {
		const { isFetching, isFetched, coupons, editing } = couponsState;

		if ( isFetched ) {
			return <CouponsList
				coupons={ coupons }
				editing={ editing }
				onCouponEdit={ this.props.editCoupon }
				onCouponCancel={ this.props.cancelCouponEdit }
				onCouponSave={ this.props.saveCoupon } />;
		}
	}
}

CouponsScreen.propTypes = {
	data: PropTypes.object.isRequired,
	coupons: PropTypes.object.isRequired,
};

function mapStateToProps( state ) {
	const { coupons } = state;

	return {
		coupons
	};
}

function mapDispatchToProps( dispatch ) {
	return bindActionCreators(
		{
			fetchCoupons,
			editCoupon,
			cancelCouponEdit,
		},
		dispatch
	);
}

export default connect( mapStateToProps, mapDispatchToProps )( CouponsScreen );

