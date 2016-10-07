import React, { PropTypes } from 'react'
import Nav from './nav';

import screenData from '../utils/screen-data';

export default class App extends React.Component {
	propTypes: {
		children: PropTypes.node,
	}

	constructor( props ) {
		super( props );

		const data = screenData( 'wc_synchrotron_data' );
		this.state = {
			currencySymbol: data.currency_symbol,
			currencyIsPrefix: Boolean( data.currency_pos_is_prefix ),
			currencyDecimals: Number( data.currency_decimals ),
		};
	}

	render() {
		const childrenWithProps = React.Children.map(
			this.props.children,
			( child ) => React.cloneElement( child, {
				currencySymbol: this.state.currencySymbol,
				currencyIsPrefix: this.state.currencyIsPrefix,
				currencyDecimals: this.state.currencyDecimals,
			} )
		);

		return (
			<div className="frame" >
				<Nav className="navigation" />
				<div className="screen" >
					{ childrenWithProps }
				</div>
			</div>
		);
	}
}
