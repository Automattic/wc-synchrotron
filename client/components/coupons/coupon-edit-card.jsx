import React, { PropTypes } from 'react';
import Card from 'components/card';
import Gridicon from 'components/gridicon';
import FormLabel from 'components/forms/form-label';
import FormTextInput from 'components/forms/form-text-input';
import FormSelect from 'components/forms/form-select';

export default class CouponEditCard extends React.Component {
	propTypes: {
		coupon: PropTypes.object.isRequired,
		onEdit: PropTypes.func.isRequired,
		onCancelClick: PropTypes.func.isRequired,
		onSaveClick: PropTypes.func.isRequired
	}

	constructor( props ) {
		super( props );

		this.couponTypes = {
			fixed_cart: { displayName: "Cart Discount", formDiv: this.cartFixedDiscountDiv },
			percent: { displayName: "Cart % Discount", formDiv: this.cartPercentDiscountDiv },
			fixed_product: { displayName: "Product Discount", formDiv: this.productDiscountDiv },
			percent_product: { displayName: "Product % Discount", formDiv: this.productPercentDiscountDiv },
			sign_up_fee: { displayName: "Sign Up Fee Discount", formDiv: this.signUpFeeDiscountDiv },
			sign_up_fee_percent: { displayName: "Sign Up Fee % Discount", formDiv: this.signUpFeePercentDiscountDiv },
			recurring_fee: { displayName: "Recurring Product Discount", formDiv: this.recurringProductDiscountDiv },
			recurring_percent: { displayName: "Recurring Product % Discount", formDiv: this.recurringProductPercentDiscountDiv }
		}

		this.onFieldChange = this.onFieldChange.bind( this );
	}

	onFieldChange( e ) {
		const { coupon, onEdit } = this.props;

		console.log( e.target.name + "=" + e.target.value );
		onEdit( coupon, e.target.name, e.target.value );
	}

	cartFixedDiscountDiv() {
		return <div>[Cart Fixed Discount]</div>;
	}

	cartPercentDiscountDiv() {
		return <div>[Cart Percent Discount]</div>;
	}

	productDiscountDiv() {
		return <div>[Product Discount]</div>;
	}

	productPercentDiscountDiv() {
		return <div>[Product Percent Discount]</div>;
	}

	signUpFeeDiscountDiv() {
		return <div>[Sign Up Fee Discount]</div>;
	}

	signUpFeePercentDiscountDiv() {
		return <div>[Sign Up Fee Percent Discount]</div>;
	}

	recurringProductDiscountDiv() {
		return <div>[Recurring Product Discount]</div>;
	}

	recurringProductPercentDiscountDiv() {
		return <div>[Recurring Product Percent Discount]</div>;
	}

	render() {
		const { coupon, onCancelClick, onSaveClick } = this.props;

		let options = [];
		for ( let ckey in this.couponTypes ) {
			options.push( <option key={ ckey } value={ ckey }>{ this.couponTypes[ckey].displayName }</option> );
		}

		return (
			<Card className="coupon-card coupon-edit-card">
				<form>
					<div>
						<FormLabel htmlFor="code">
							Coupon Code:
						</FormLabel>
						<FormTextInput
								name="code"
								value={ coupon.code }
								onChange={ this.onFieldChange } />
					</div>

					<div>
						<FormLabel htmlFor="description">
							Description:
						</FormLabel>
						<FormTextInput
								name="description"
								value={ coupon.description }
								onChange={ this.onFieldChange } />
					</div>

					<div>
						<FormLabel htmlFor="type">
							Type:
						</FormLabel>
						<FormSelect
								name="type"
								value={ coupon.type }
								onChange={ this.onFieldChange } >
							{ options }
						</FormSelect>
					</div>

					<Gridicon
						className="cancel-icon"
						icon="undo"
						onClick={ () => { onCancelClick( coupon ); } } />
					<Gridicon
						className="save-icon"
						icon="checkmark-circle"
						onClick={ () => { onSaveClick( coupon ); } } />
				</form>
			</Card>
		);
	}
}

