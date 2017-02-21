import React, { PropTypes } from 'react';
import Card from 'components/card';
import Gridicon from 'gridicons';

export default class CouponCard extends React.Component {
	propTypes: {
		coupon: PropTypes.object.isRequired,
		onEditClick: PropTypes.func,
	}

	constructor( props ) {
		super( props );

		this.onEditIconClick = this.onEditIconClick.bind( this );
	}

	onEditIconClick() {
		const { coupon, onEditClick } = this.props;
		onEditClick( coupon );
	}

	render() {
		const { coupon, onEditClick } = this.props;
		let editIcon;

		if ( onEditClick ) {
			editIcon = <Gridicon
				className="edit-icon"
				icon="cog"
				onClick={ this.onEditIconClick } />;
		} else {
			editIcon = null;
		}

		return (
			<Card className="coupon-card">
				<strong> "{ coupon.code }" </strong>
				<p> { coupon.description } </p>
				{ editIcon }
			</Card>
		);
	}
}
