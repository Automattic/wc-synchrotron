import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchTaxRates, editTaxRate, updateTaxRates } from '../../state/tax-rates/actions';
import TaxRatesScreen from './tax-rates-screen';

class TaxRatesScreenContainer extends React.Component {
	constructor( props ) {
		super( props );
		this.onSave = this.onSave.bind( this );
	}

	propTypes: {
		data         : PropTypes.object.isRequired,
		taxRatesState: PropTypes.object.isRequired,
	}

	componentDidMount() {
		this.props.fetchTaxRates();
	}

	onSave() {
		this.props.updateTaxRates( this.props.taxRatesState.editing );
	}

	render() {
		return <TaxRatesScreen taxRatesState={ this.props.taxRatesState } i18n={ this.props.data.i18n } onTaxRateEdit={ this.props.editTaxRate } onSave={ this.onSave } />;
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
			editTaxRate,
			updateTaxRates
		},
		dispatch
	);
}

export default connect( mapStateToProps, mapDispatchToProps )( TaxRatesScreenContainer );
