import debug from 'debug';

const error = debug( 'synchrotron:error' );

export default function screenData( elementName ) {
	const element = document.getElementById( elementName );
	let data = null;

	if ( element ) {
		data = JSON.parse( element.textContent );
	} else {
		error( 'Failed to find Screen Data HTML Element: "' + elementName + '"' );
	}

	return data;
}
