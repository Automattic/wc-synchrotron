import React, { PropTypes } from 'react';
import TaxRateRow from './tax-rate-row';
import Helptip from 'components/helptip';

export default class TaxRatesTable extends React.Component {
	propTypes: {
		taxRates: PropTypes.array.isRequired,
		data: PropTypes.object.isRequired,
		onTaxRateEdit: PropTypes.func.isRequired,
	}

	constructor( props ) {
		super( props );
		this.renderTaxRate = this.renderTaxRate.bind( this );
	}

	renderTaxRate( taxRate ) {
		const { editing, onTaxRateEdit, data } = this.props;
		let row;

		if ( taxRate.id in editing ) {
			row = <TaxRateRow
				key={ taxRate.id }
				data={ data }
				taxRate={ editing[ taxRate.id ] }
				onEdit={ onTaxRateEdit } />;
		} else {
			row = <TaxRateRow
				key={ taxRate.id }
				data={ data }
				taxRate={ taxRate }
				onEdit={ onTaxRateEdit } />;
		}

		return row;
	}

	render() {
		const { taxRates, data } = this.props;
		const i18n = data.strings;

		return (
			<div>
				<table className="wc_tax_rates wc_input_table sortable widefat">
					<thead>
						<tr>
							<th className="sort">&nbsp;</th>
							<th width="8%"><a href="http://en.wikipedia.org/wiki/ISO_3166-1#Current_codes" target="_blank">{ i18n.country_code.replace( ' ', '\u00A0' ) }</a>&nbsp;<Helptip text={ i18n.country_code_hint } /></th>
							<th width="8%">{ i18n.state_code.replace( ' ', '\u00A0' ) }&nbsp;<Helptip text={ i18n.state_code_hint } /></th>
							<th>{ i18n.postcode.replace( ' ', '\u00A0' ) }&nbsp;<Helptip text={ i18n.postcode_hint } /></th>
							<th>{ i18n.city.replace( ' ', '\u00A0' ) }&nbsp;<Helptip text={ i18n.city_hint } /></th>
							<th width="8%">{ i18n.rate.replace( ' ', '\u00A0' ) }&nbsp;<Helptip text={ i18n.rate_hint } /></th>
							<th width="8%">{ i18n.tax_name.replace( ' ', '\u00A0' ) }&nbsp;<Helptip text={ i18n.tax_name_hint } /></th>
							<th width="8%">{ i18n.priority.replace( ' ', '\u00A0' ) }&nbsp;<Helptip text={ i18n.priority_hint } /></th>
							<th width="8%">{ i18n.compound.replace( ' ', '\u00A0' ) }&nbsp;<Helptip text={ i18n.compound_hint } /></th>
							<th width="8%">{ i18n.shipping.replace( ' ', '\u00A0' ) }&nbsp;<Helptip text={ i18n.shipping_hint } /></th>
						</tr>
					</thead>
					<tfoot>
						<tr>
							<th colSpan="10">
								<a href="#" className="button plus insert">{ i18n.insert_row }</a>
								<a href="#" className="button minus remove_tax_rates">{ i18n.remove_rows }</a>
								<a href="#" download="tax_rates.csv" className="button export">{ i18n.export_csv }</a>
								<a href="{i18n.import_url}" className="button import">{ i18n.import_csv }</a>
							</th>
						</tr>
					</tfoot>
					<tbody id="rates">
						{ taxRates.map( this.renderTaxRate ) }
					</tbody>
				</table>
			</div>
		);
	}
}
