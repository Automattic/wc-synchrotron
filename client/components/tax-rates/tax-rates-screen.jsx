import React, { PropTypes } from 'react';
import lodash from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchTaxRates, editTaxRate } from '../../state/tax-rates/actions';
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
		const { isFetching, isFetched, taxRates, editing } = this.props.taxRatesState;

		return (
			<div className="wrap">
				<h3>{ this.props.data.strings.tax_rates }</h3>
				<TaxRatesTable
					taxRates={ taxRates }
					data={ this.props.data }
					editing={ editing }
					onTaxRateEdit={ this.props.editTaxRate }
					/>
			</div>
		);
	}
}

TaxRatesScreen.propTypes = {
	data: PropTypes.object.isRequired,
	taxRatesState: PropTypes.object.isRequired,
};

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

export default connect( mapStateToProps, mapDispatchToProps )( TaxRatesScreen );
