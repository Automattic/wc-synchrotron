import React, { PropTypes } from 'react';
import { localize } from 'i18n-calypso';
import Button from 'components/button';

class AddCoupon extends React.Component {
	propTypes: {
		translate: PropTypes.func.isRequired,
		onAddCoupon: PropTypes.func.isRequired
	}

	constructor( props ) {
		super( props );
	}

	render() {
		const __ = this.props.translate;
		let { onAddCoupon } = this.props;

		return (
			<div>
				<Button primary onClick={ onAddCoupon } >{ __( 'Add Coupon' ) }</Button>
			</div>
		);
	}
}

export default localize( AddCoupon );

