import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchCoupons } from '../state/coupons/actions';

export default class CouponsScreen extends React.Component {
	constructor( props ) {
		super( props );
		this.onClick = this.onClick.bind( this );
	}

	onClick() {
		this.props.dispatch( fetchCoupons() );
	}

	render() {
		return (
			<div>
				<h3>React output for Coupons Screen.</h3>
				<button onClick={ this.onClick }>Click me</button>
			</div>
		);
	}
}

CouponsScreen.propTypes = {
	dispatch: PropTypes.func.isRequired
};

function mapStateToProps( state ) {
	return { };
}

export default connect( mapStateToProps )( CouponsScreen );

