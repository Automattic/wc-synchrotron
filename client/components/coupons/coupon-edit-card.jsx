import React, { PropTypes } from 'react';
import { translate as __ } from 'lib/mixins/i18n';
import Accordion from 'components/accordion';
import Card from 'components/card';
import Gridicon from 'components/gridicon';
import FormCheckbox from 'components/forms/form-checkbox';
import FormLabel from 'components/forms/form-label';
import FormTextInput from 'components/forms/form-text-input';
import FormDateInput from 'components/forms/form-date-input';
import FormTextInputWithAffixes from 'components/forms/form-text-input-with-affixes';
import FormSelect from 'components/forms/form-select';
import screenData from '../../utils/screen-data';

export default class CouponEditCard extends React.Component {
	propTypes: {
		coupon: PropTypes.object.isRequired,
		onEdit: PropTypes.func.isRequired,
		onCancelClick: PropTypes.func.isRequired,
		onSaveClick: PropTypes.func.isRequired,
	}

	constructor( props ) {
		super( props );

		this.couponTypes = {
			fixed_cart: { displayName: __( 'Cart Discount' ), formDiv: this.fixedDiscountDiv },
			percent: { displayName: __( 'Cart % Discount' ), formDiv: this.percentDiscountDiv },
			fixed_product: { displayName: __( 'Product Discount' ), formDiv: this.fixedDiscountDiv },
			percent_product: { displayName: __( 'Product % Discount' ), formDiv: this.percentDiscountDiv },
			sign_up_fee: { displayName: __( 'Sign Up Fee Discount' ), formDiv: this.fixedDiscountDiv },
			sign_up_fee_percent: { displayName: __( 'Sign Up Fee % Discount' ), formDiv: this.percentDiscountDiv },
			recurring_fee: { displayName: __( 'Recurring Product Discount' ), formDiv: this.fixedDiscountDiv },
			recurring_percent: { displayName: __( 'Recurring Product % Discount' ), formDiv: this.percentDiscountDiv },
		}

		this.onFieldChange = this.onFieldChange.bind( this );
		this.onCheckboxChange = this.onCheckboxChange.bind( this );
		this.onCancelIconClick = this.onCancelIconClick.bind( this );
		this.onSaveIconClick = this.onSaveIconClick.bind( this );
	}

	onFieldChange( e ) {
		const { coupon, onEdit } = this.props;

		onEdit( coupon, e.target.name, e.target.value );
	}

	onCheckboxChange( e ) {
		const { coupon, onEdit } = this.props;

		onEdit( coupon, e.target.name, e.target.checked );
	}

	onCancelIconClick() {
		const { coupon, onCancelClick } = this.props;
		onCancelClick( coupon );
	}

	onSaveIconClick() {
		const { coupon, onSaveClick } = this.props;
		onSaveClick( coupon );
	}

	fixedDiscountDiv( coupon, onChange ) {
		const { currency_symbol, currency_pos_is_prefix } = screenData( 'wc_coupon_screen_data' );

		let field;

		if ( currency_pos_is_prefix ) {
			field = <FormTextInputWithAffixes
						name="amount"
						prefix={ currency_symbol }
						value={ coupon.amount }
						onChange={ onChange } />;
		} else {
			field = <FormTextInputWithAffixes
						name="amount"
						suffix={ currency_symbol }
						value={ coupon.amount }
						onChange={ onChange } />;
		}

		return (
			<div>
				<FormLabel htmlFor="amount">
					{ __( 'Discount:' ) }
				</FormLabel>
				{ field }
			</div>
		);
	}

	percentDiscountDiv( coupon, onChange ) {
		return (
			<div>
				<FormLabel htmlFor="amount">
					{ __( 'Discount:' ) }
				</FormLabel>
				<FormTextInputWithAffixes
						name="amount"
						suffix="%"
						value={ coupon.amount }
						onChange={ onChange } />
			</div>
		);
	}

	render() {
		const { coupon } = this.props;

		let options = [];
		for ( let ckey in this.couponTypes ) {
			options.push( <option key={ ckey } value={ ckey }>{ this.couponTypes[ckey].displayName }</option> );
		}

		return (
			<Card className="coupon-card coupon-edit-card">
				<form>
					<div>
						<FormLabel htmlFor="code">
							{ __( 'Coupon Code:' ) }
						</FormLabel>
						<FormTextInput
								name="code"
								value={ coupon.code }
								onChange={ this.onFieldChange } />
					</div>

					<div>
						<FormLabel htmlFor="description">
							{ __( 'Description:' ) }
						</FormLabel>
						<FormTextInput
								name="description"
								value={ coupon.description }
								onChange={ this.onFieldChange } />
					</div>

					<div>
						<FormLabel htmlFor="discount_type">
							{ __( 'Type:' ) }
						</FormLabel>
						<FormSelect
								name="discount_type"
								value={ coupon.discount_type }
								onChange={ this.onFieldChange } >
							{ options }
						</FormSelect>
					</div>

					{ this.couponTypes[coupon.discount_type].formDiv( coupon, this.onFieldChange ) }

					<div>
						<FormLabel htmlFor="free_shipping">
							{ __( 'Free Shipping?' ) }
						</FormLabel>
						<FormCheckbox
								name="free_shipping"
								checked={ coupon.free_shipping }
								onChange={ this.onCheckboxChange } />
					</div>

					<div>
						<FormLabel htmlFor="expiry_date">
							{ __( 'Expiration Date:' ) }
						</FormLabel>
						<FormDateInput
								name="expiry_date"
								value={ coupon.expiry_date }
								onChange={ this.onFieldChange } />
					</div>

					<Accordion title={ __( 'Restrictions' ) } >

						<div>
							<FormLabel htmlFor="minimum_amount">
								{ __( 'Minimum Cart:' ) }
							</FormLabel>
							<FormTextInput
									name="minimum_amount"
									value={ coupon.minimum_amount }
									onChange={ this.onFieldChange } />
						</div>

						<div>
							<FormLabel htmlFor="maximum_amount">
								{ __( 'Maximum Cart:' ) }
							</FormLabel>
							<FormTextInput
									name="maximum_amount"
									value={ coupon.maximum_amount }
									onChange={ this.onFieldChange } />
						</div>

						<div>
							<FormLabel htmlFor="individual_use">
								{ __( 'Individual Use Only?' ) }
							</FormLabel>
							<FormCheckbox
									name="individual_use"
									checked={ coupon.individual_use }
									onChange={ this.onCheckboxChange } />
						</div>

						<div>
							<FormLabel htmlFor="exclude_sale_items">
								{ __( 'Exclude Sale Items?' ) }
							</FormLabel>
							<FormCheckbox
									name="exclude_sale_items"
									checked={ coupon.exclude_sale_items }
									onChange={ this.onCheckboxChange } />
						</div>

					</Accordion>

					<Gridicon
						className="cancel-icon"
						icon="undo"
						onClick={ this.onCancelIconClick } />
					<Gridicon
						className="save-icon"
						icon="checkmark-circle"
						onClick={ this.onSaveIconClick } />
				</form>
			</Card>
		);
	}
}

