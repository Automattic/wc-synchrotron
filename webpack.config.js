var path = require( 'path' );
var webpack = require( 'webpack' );

module.exports = {
	entry: {
		coupons: './entry/coupons.jsx'
	},
	output: {
		path: path.join( __dirname, 'dist' ),
		publicPath: 'wp-includes/js',
		filename: '[name]_bundle.js'
	},
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				include: [
					path.resolve( __dirname, 'components' ),
					path.resolve( __dirname, 'entry' )
				],
				loader: 'babel'
			}
		]
	},
	resolve: {
		extensions: [ '', '.js', '.jsx' ],
		modulesDirectories: [ 'node_modules' ]
	},
	plugins: [
		new webpack.NoErrorsPlugin()
	]
};

