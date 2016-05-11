import debug from 'debug';

const error = debug( 'synchrotron:error' );

export default function screenData( id ) {
	let data = null;

	if ( typeof window[ id ] === 'object' ) {
		data = window[ id ];
	} else {
		error( 'Failed to find Screen Data Element: "' + id + '"' );
	}

	return data;
}
