import React from 'react';
import Gridicon from 'gridicons/react/gridicon';
import FormTextInput from 'components/forms/form-text-input';

export function renderString( product, key ) {
	return product[key];
}

export function renderInteger( product, key, nanString = 'N/A' ) {
	const value = Number( product[key] );
	if ( value ) {
		return ( ! isNaN( value ) ? value : nanString );
	} else {
		return '';
	}
}

export function renderBoolean( product, key, trueValues = [ true, 'true', 'yes' ], trueIcon = 'checkmark', falseIcon = 'cross-small' ) {
	const value = trueValues.includes( product[key] );
	if ( value ) {
		return trueIcon && <Gridicon icon={ trueIcon } />;
	} else {
		return falseIcon && <Gridicon icon={ falseIcon } />;
	}
}

export function renderCurrency( product, key ) {
	const value = product[key];
	// TODO: Get the currency symbol and format properly!!
	if ( value ) {
		return '$' + value;
	} else {
		return '';
	}
}

export function renderDimensions( product, key ) {
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

export function renderCategories( product, key ) {
	const value = product[key];

	if ( value ) {
		let names = value.map( ( c ) => c.name );

		return names.join();
	} else {
		return '';
	}
}

export function renderTags( product, key ) {
	const value = product[key];

	if ( value ) {
		let names = value.map( ( c ) => c.name );

		return names.join();
	} else {
		return '';
	}
}

export function renderTextInput( product, key, title ) {
	return (
		<FormTextInput id={ key } value={ product[key] } />
	);
}

