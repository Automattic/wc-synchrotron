import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchTaxRates, editTaxRate } from '../../state/tax-rates/actions';
import TaxRatesScreen from './tax-rates-screen';

class TaxRatesScreenContainer extends React.Component {
	constructor( props ) {
		super( props );
	}

	propTypes: {
		data         : PropTypes.object.isRequired,
		taxRatesState: PropTypes.object.isRequired,
	}

	componentDidMount() {
		const { data } = this.props;
		this.props.fetchTaxRates( data.endpoints.get_tax_rates, data.nonce );
	}

	render() {
		return <TaxRatesScreen taxRatesState={ this.props.taxRatesState } i18n={ this.props.data.i18n } />;
	}
}

function mapStateToProps( state ) {
	return {
		taxRatesState: state.taxRates
	};
}

function mapDispatchToProps( dispatch ) {
	return bindActionCreators(
		{
			fetchTaxRates,
			editTaxRate
		},
		dispatch
	);
}

export default connect( mapStateToProps, mapDispatchToProps )( TaxRatesScreenContainer );
