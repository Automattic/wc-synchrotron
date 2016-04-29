import debug from 'debug';
import ReactInjection from 'react/lib/ReactInjection';
import classes from 'component-classes';
import i18n from 'lib/mixins/i18n';
import injectTapEventPlugin from 'react-tap-event-plugin';
import touchDetect from 'lib/touch-detect';

const bootDebug = debug( 'synchrotron:calypso-boot' );

export default function boot() {
	let i18nLocaleStringsObject = null;

	bootDebug( 'Starting Calypso Support' );

	// Initialize i18n
	if ( window.i18nLocaleStrings ) {
		i18nLocaleStringsObject = JSON.parse( window.i18nLocaleStrings );
	}
	i18n.initialize( i18nLocaleStringsObject );

	ReactInjection.Class.injectMixin( i18n.mixin );

	// Infer touch screen by checking if device supports touch events
	if ( touchDetect.hasTouch() ) {
		classes( document.documentElement ).add( 'touch' );
	} else {
		classes( document.documentElement ).add( 'notouch' );
	}

	// Initialize touch
	injectTapEventPlugin();
}

boot();
