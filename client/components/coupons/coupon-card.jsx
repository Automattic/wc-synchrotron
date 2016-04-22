import React, { PropTypes } from 'react';
import Card from 'components/card';
import Gridicon from 'components/gridicon';

export default class CouponCard extends React.Component {
	propTypes: {
		coupon: PropTypes.object.isRequired,
		onEditClick: PropTypes.func,
	}

	render() {
		const { coupon, onEditClick } = this.props;
		let editIcon;

		if ( onEditClick ) {
			editIcon = <Gridicon
				className="edit-icon"
				icon="cog"
				onClick={ () => { onEditClick( coupon ) } } />;
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

