import React from 'react';
import Gridicon from 'gridicons/react/gridicon';
import FormCheckbox from 'components/forms/form-checkbox';
import FormSelect from 'components/forms/form-select';
import FormTextInput from 'components/forms/form-text-input';
import FormNumberInput from 'components/forms/form-number-input';
import FormCurrencyInput from 'components/forms/form-currency-input';
import FormTextInputWithAffixes from 'components/forms/form-text-input-with-affixes';
import FormNumberInputWithAffixes from 'components/forms/form-number-input-with-affixes';
import TokenField from 'components/token-field';

// View Renderers
// Parameter Format: product, key, constraints, helpers

export function renderString( product, key, constraints, helpers ) {
	return product[key];
}

// Constraint (optional): nanString - Custom string for when value is NaN
export function renderInteger( product, key, constraints, helpers ) {
	const value = Number( product[key] );
	const nanString = constraints && constraints.nanString || '';

	if ( value ) {
		return ( ! isNaN( value ) ? value : nanString );
	} else {
		return '';
	}
}

// Constraint (optional): trueValues - Custom set of values that denote true
// Constraint (optional): trueIcon - Custom icon for when value is true
// Constraint (optional): falseIcon - Custom icon for when value is false
export function renderBoolean( product, key, constraints, helpers ) {
	const trueValues = constraints && constraints.trueValues || [ true, 'true', 'yes' ];
	const trueIcon = ( constraints && constraints.hasOwnProperty( 'trueIcon' ) ? constraints.trueIcon : 'checkmark' );
	const falseIcon = ( constraints && constraints.hasOwnProperty( 'falseIcon' ) ? constraints.falseIcon : 'cross-small' );
	const value = trueValues.includes( product[key] );

	if ( value ) {
		return trueIcon && <Gridicon icon={ trueIcon } />;
	} else {
		return falseIcon && <Gridicon icon={ falseIcon } />;
	}
}

export function renderCurrency( product, key, constraints, helpers ) {
	const value = product[key];
	const { currencySymbol, currencyIsPrefix, currencyDecimals, numberFormat } = helpers;
	if ( value ) {
		let number = numberFormat( value, currencyDecimals );
		let text;

		if ( currencyIsPrefix ) {
			text = currencySymbol + number;
		} else {
			text = number + currencySymbol;
		}
		return text;
	} else {
		return '';
	}
}

export function renderDimensions( product, key, constraints, helpers ) {
	const value = product[key];

	if ( value && ( value.length || value.width || value.height ) ) {
		const l = value.length ? Number( value.length ) : '-';
		const w = value.width ? Number( value.width ) : '-';
		const h = value.height ? Number( value.height ) : '-';

		return l + '/' + w + '/' + h;
	} else {
		return '';
	}
}

export function renderCategories( product, key, constraints, helpers ) {
	const value = product[key];

	if ( value ) {
		let names = value.map( ( c ) => c.name );

		return names.join();
	} else {
		return '';
	}
}

export function renderTags( product, key, constraints, helpers ) {
	const value = product[key];

	if ( value ) {
		let names = value.map( ( c ) => c.name );

		return names.join();
	} else {
		return '';
	}
}

// Edit Renderers
// Parameter Format: product, key, constraints, helpers, disabled, onEdit

export function renderTextInput( product, key, constraints, helpers, disabled, onEdit ) {
	const onChange = ( evt ) => {
		const value = evt.target.value;
		// TODO: Add customizable validation step here?
		onEdit( product, key, value );
	};

	return (
		<FormTextInput id={ key } disabled={ disabled } value={ product[ key ] } onChange={ onChange } />
	);
}

// Constraint (optional): min - Minimunm numeric value allowed.
// Constraint (optional): max - Maximum numeric value allowed.
export function renderNumberInput( product, key, constraints, helpers, disabled, onEdit ) {
	const onChange = ( evt ) => {
		const value = evt.target.value;
		// TODO: Add customizable validation step here?
		onEdit( product, key, value );
	};

	const constraintsProps = {};

	if ( constraints ) {
		if ( constraints.min ) {
			constraintsProps.min = constraints.min;
		} else if ( constraints.max ) {
			constraintsProps.max = constraints.max;
		}
	}

	const value = product[ key ] || '';

	return (
		<FormNumberInput
			id={ key }
			disabled={ disabled }
			value={ value }
			onChange={ onChange }
			{ ...constraintsProps } />
	);
}

export function renderCurrencyInput( product, key, constraints, helpers, disabled, onEdit ) {
	const onChange = ( evt ) => {
		const value = evt.target.value;
		// TODO: Add customizable validation step here?
		onEdit( product, key, value );
	};

	const constraintsProps = {};

	if ( constraints ) {

		if ( constraints.min ) {
			constraintsProps.min = constraints.min;
		} else if ( constraints.max ) {
			constraintsProps.max = constraints.max;
		}
	}

	const value = product[ key ] || '';

	return (
		<FormCurrencyInput
			id={ key }
			disabled={ disabled }
			value={ value }
			onChange={ onChange }
			currencySymbol={ helpers.currencySymbol }
			currencySymbolIsPrefix={ helpers.currencyIsPrefix }
			{ ...constraintsProps }
		/>
	);
}

// Constraint (optional): trueValue - Custom value that is set when checkbox is checked.
// Constraint (optional): falseValue - Custom value that is set when checkbox is checked.
export function renderCheckboxInput( product, key, constraints, helpers, disabled, onEdit ) {
	const trueValue = ( constraints && constraints.hasOwnProperty( 'trueValue' ) ? constraints.trueValue : true );
	const falseValue = ( constraints && constraints.hasOwnProperty( 'falseValue' ) ? constraints.falseValue : false );
	const value = trueValue === product[ key ];

	const onChange = ( evt ) => {
		const value = ( evt.target.checked ? trueValue : falseValue );
		onEdit( product, key, value );
	}

	return (
		<FormCheckbox id={ key } disabled={ disabled } checked={ value } onChange={ onChange } />
	);
}

// Constraint (required): getSelectValue - Function( product, key ), returns scalar value for select.
// Constraint (required): getOptions - Function( product, key, helpers ), return array of: { name: <string>, value: <any> }
export function renderSelectInput( product, key, constraints, helpers, disabled, onEdit ) {
	const getSelectValue = ( constraints && constraints.hasOwnProperty( 'getSelectValue' ) ? constraints.getSelectValue : null );
	const getOptions = ( constraints && constraints.hasOwnProperty( 'getOptions' ) ? constraints.getOptions : null );
	const options = ( 'function' === typeof getOptions ? getOptions( product, key, helpers ) : [] );
	const value = (
		'function' === typeof constraints.inConvert ? constraints.inConvert( product[ key ], helpers ) : product[ key ]
	);

	const onChange = ( evt ) => {
		const value = (
			'function' === typeof constraints.outConvert ? constraints.outConvert( evt.target.value, helpers ) : evt.target.value
		);
		onEdit( product, key, value );
	}

	let optionTags = [];
	options.forEach( ( option ) => {
		optionTags.push( <option key={ option.name } value={ option.value } >{ option.name }</option> );
	} );

	return (
		<FormSelect id={ key } disabled={ disabled } value={ value } onChange={ onChange } >
			{ optionTags }
		</FormSelect>
	);
}

// Constraint (required): getSuggestions - Function ( product, key, helpers ), return array of strings
// Constraint (optional): inConvert - Function ( dataValue, helpers ),
//                        converts from product[ key ] to TokenField value array.
// Constraint (optional): outConvert - Function ( tokenFieldValue, helpers ),
//                        converts from TokenField-compatible values to product[ key ] value.
export function renderTokenField( product, key, constraints, helpers, disabled, onEdit ) {
	const suggestions = (
		'function' === typeof constraints.getSuggestions ? constraints.getSuggestions( product, key, helpers ) : []
	);
	const value = (
		'function' === typeof constraints.inConvert ? constraints.inConvert( product[ key ], helpers ) : product[ key ]
	);

	const onChange = ( value ) => {
		value = (
			'function' === typeof constraints.outConvert ? constraints.outConvert( value, helpers ) : value
		);
		onEdit( product, key, value );
	}

	return (
		<TokenField
			id={ key }
			value={ value }
			onChange={ onChange }
			suggestions={ suggestions }
			disabled={ disabled }
		/>
	);
}

