var path = require( 'path' );
var webpack = require( 'webpack' );
var ExtractTextPlugin = require( 'extract-text-webpack-plugin' );

module.exports = {
	entry: {
		coupons: './client/entry/coupons.jsx'
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
					path.resolve( __dirname, 'client' ),
					path.resolve( __dirname, 'node_modules', 'wp-calypso', 'client' ),
				],
				loader: 'babel'
			},
			{
				test: /\.json$/,
				loader: 'json-loader'
			},
			{
				test: /\.scss$/,
				include: [
					path.resolve( __dirname, 'assets', 'stylesheets' ),
					path.resolve( __dirname, 'client' )
				],
				loader: ExtractTextPlugin.extract( 'style', 'css?minimize!sass' )
			},
			{
				test: /\.html$/,
				loader: 'html-loader'
			}
		]
	},
	sassLoader: {
		includePaths: [
			path.resolve( __dirname, 'node_modules', 'wp-calypso', 'client' ),
			path.resolve( __dirname, 'node_modules', 'wp-calypso', 'assets', 'stylesheets' )
		]
	},
	resolve: {
		extensions: [ '', '.js', '.jsx', '.scss', '.html' ],
		modulesDirectories: [ 'node_modules' ],
		root: [
			path.join( __dirname, 'client' ),
			path.join( __dirname, 'node_modules', 'wp-calypso', 'client' )
		]
	},
	plugins: [
		new webpack.NoErrorsPlugin(),
		new ExtractTextPlugin( '[name].css' )
	]
};

