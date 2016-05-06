import debug from 'debug';

const error = debug( 'synchrotron:error' );

export default function screenData( id ) {
	let data = null;

	if ( typeof window[ id ] === 'object' ) {
		data = window[ id ];
	} else {
		const element = document.getElementById( id );
		let data = null;

		if ( element ) {
			data = JSON.parse( element.textContent );
		} else {
			error( 'Failed to find Screen Data HTML Element: "' + id + '"' );
		}
	}

	return data;
}
