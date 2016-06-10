import React, { PropTypes } from 'react';
import { translate as __ } from 'lib/mixins/i18n';
import Button from 'components/button';

export default class AddCoupon extends React.Component {
	propTypes: {
		onAddCoupon: PropTypes.func.isRequired
	}

	constructor( props ) {
		super( props );
	}

	render() {
		let { onAddCoupon } = this.props;

		return (
			<div>
				<Button primary onClick={ onAddCoupon } >{ __( 'Add Coupon' ) }</Button>
			</div>
		);
	}
}

