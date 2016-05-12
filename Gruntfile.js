/*
 * This is for i18n pot file generation only. The rest of the build is
 * in webpack.config.js
 */

module.exports = function ( grunt ) {
	'use strict';

	grunt.initConfig( {
		makepot: {
			options: {
				type: 'wp-plugin',
				domainPath: 'i18n/languages',
				potHeaders: {
					'report-msgid-bugs-to': 'https://github.com/automattic/wc-synchrotron/issues',
					'language-team': 'LANGUAGE <EMAIL@ADDRESS>'
				}
			},
			dist: {
				options: {
					potFilename: 'wc-synchrotron.pot',
					include: [
						'dist/.*-strings.php'
					],
				}
			}
		}
	} );

	grunt.loadNpmTasks( 'grunt-wp-i18n' );

	grunt.registerTask( 'dev', [ 'makepot' ] );
}

