import React from 'react';
import FormTextInput from 'components/forms/form-text-input';

export function renderTextInput( product, key, title ) {
	return (
		<FormTextInput id={ key } value={ product[key] } />
	);
}

