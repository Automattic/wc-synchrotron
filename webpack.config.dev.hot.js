var CopyWebpackPlugin = require( 'copy-webpack-plugin' );
var config = require( './webpack.config' );

config.plugins = [
	...config.plugins,
	new CopyWebpackPlugin( [
		{ from: 'config/synchrotron-config-dev-hot.php', to: 'synchrotron-config.php' }
	] )
];

module.exports = config;

