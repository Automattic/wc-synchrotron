import React, { PropTypes } from 'react';
import TaxRateRow from './tax-rate-row';
import Tooltip from 'components/tooltip';

export default class TaxRatesTable extends React.Component {
	propTypes: {
		taxRates: PropTypes.array.isRequired,
		data: PropTypes.object.isRequired,
	}

	constructor( props ) {
		super( props );
		this.onTaxRateChange = this.onTaxRateChange.bind( this );
	}

	onTaxRateChange( id, key, value ) {
		/*var tax_rates = this.state.tax_rates;
		var index     = _.findIndex(tax_rates, {id: id});

		tax_rates[ index ][ key ] = value;

		this.setState({tax_rates: tax_rates});*/
	}

	render() {
		const { taxRates, data } = this.props;
		let i18n = data.strings;

		return (
			<div>
				<table className="wc_tax_rates wc_input_table sortable widefat">
					<thead>
						<tr>
							<th className="sort">&nbsp;</th>
							<th width="8%"><a href="http://en.wikipedia.org/wiki/ISO_3166-1#Current_codes" target="_blank">{ i18n.country_code.replace( ' ', '\u00A0' ) }</a>&nbsp;<Tooltip isVisible={ true }>{ i18n.country_code_hint }</Tooltip></th>
							<th width="8%">{ i18n.state_code.replace( ' ', '\u00A0' ) }&nbsp;<Tooltip isVisible={ true }>{ i18n.state_code_hint }</Tooltip></th>
							<th>{ i18n.postcode.replace( ' ', '\u00A0' ) }&nbsp;<Tooltip isVisible={ true }>{ i18n.postcode_hint }</Tooltip></th>
							<th>{ i18n.city.replace( ' ', '\u00A0' ) }&nbsp;<Tooltip isVisible={ true }>{ i18n.city_hint }</Tooltip></th>
							<th width="8%">{ i18n.rate.replace( ' ', '\u00A0' ) }&nbsp;<Tooltip isVisible={ true }>{ i18n.rate_hint }</Tooltip></th>
							<th width="8%">{ i18n.tax_name.replace( ' ', '\u00A0' ) }&nbsp;<Tooltip isVisible={ true }>{ i18n.tax_name_hint }</Tooltip></th>
							<th width="8%">{ i18n.priority.replace( ' ', '\u00A0' ) }&nbsp;<Tooltip isVisible={ true }>{ i18n.priority_hint }</Tooltip></th>
							<th width="8%">{ i18n.compound.replace( ' ', '\u00A0' ) }&nbsp;<Tooltip isVisible={ true }>{ i18n.compound_hint }</Tooltip></th>
							<th width="8%">{ i18n.shipping.replace( ' ', '\u00A0' ) }&nbsp;<Tooltip isVisible={ true }>{ i18n.shipping_hint }</Tooltip></th>
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
						{
							taxRates.map( ( rowData ) => {
								return (
									<TaxRateRow
										key={ rowData.id }
										data={ data }
										rowData={ rowData }
										onChange={ this.onTaxRateChange }
										/>
								);
							} )
						}
					</tbody>
				</table>
			</div>
		);
	}
}
