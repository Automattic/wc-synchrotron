import React, { PropTypes } from 'react';
import TaxRatesTable from './tax-rates-table';
import ReactTooltip from 'react-tooltip';

export default class TaxRatesScreen extends React.Component {
	propTypes: {
		taxRatesState: PropTypes.object.isRequired,
		i18n         : PropTypes.object.isRequired,
	}

	render() {
		const { isFetching, isFetched, taxRates, editing } = this.props.taxRatesState;

		return (
			<div>
				<h1 className="page-title">{ this.props.i18n.tax_rates }</h1>
				<TaxRatesTable
					taxRates      ={ taxRates }
					i18n          ={ this.props.i18n }
					editing       ={ editing }
					onTaxRateEdit ={ this.props.onTaxRateEdit }
					onSave        = {this.props.onSave}
					/>
				<ReactTooltip effect="solid" multiline={ true } place="bottom" />
			</div>
		);
	}
}
