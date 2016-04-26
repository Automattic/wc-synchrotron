import React, { PropTypes } from 'react';
import lodash from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchTaxRates } from '../../state/tax-rates/actions';
import TaxRatesTable from './tax-rates-table';

class TaxRatesScreen extends React.Component {
	constructor( props ) {
		super( props );
	}

	componentDidMount() {
		const { data } = this.props;
		this.props.fetchTaxRates( data.endpoints.get_tax_rates, data.nonce );
	}

	render() {

		window.console.log( this.props );

		return (
			<div className="wrap">
				<h3>{ this.props.data.strings.tax_rates }</h3>
				<TaxRatesTable taxRates={ this.props.taxRates } data={ this.props.data } />
			</div>
		);
	}
}

TaxRatesScreen.propTypes = {
	data: PropTypes.object.isRequired,
	taxRates: PropTypes.object.isRequired,
};

function mapStateToProps( state ) {
	window.console.log( state );
	return {
		taxRates: state.taxRates
	};
}

function mapDispatchToProps( dispatch ) {
	return bindActionCreators(
		{
			fetchTaxRates
		},
		dispatch
	);
}

export default connect( mapStateToProps, mapDispatchToProps )( TaxRatesScreen );
