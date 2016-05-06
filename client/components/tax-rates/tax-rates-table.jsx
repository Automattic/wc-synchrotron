import React, { PropTypes } from 'react';
import TaxRateRow from './tax-rate-row';
import Helptip from 'components/helptip';
import Button from 'components/button';

export default class TaxRatesTable extends React.Component {
	propTypes: {
		taxRates     : PropTypes.array.isRequired,
		i18n         : PropTypes.object.isRequired,
		onTaxRateEdit: PropTypes.func.isRequired,
		onSave       : PropTypes.func.isRequired,
	}

	constructor( props ) {
		super( props );
		this.renderTaxRate = this.renderTaxRate.bind( this );
	}

	renderTaxRate( taxRate ) {
		const { editing, onTaxRateEdit, i18n } = this.props;
		let row;

		if ( taxRate.id in editing ) {
			row = <TaxRateRow
				key={ taxRate.id }
				i18n={ i18n }
				taxRate={ editing[ taxRate.id ] }
				onEdit={ onTaxRateEdit } />;
		} else {
			row = <TaxRateRow
				key={ taxRate.id }
				i18n={ i18n }
				taxRate={ taxRate }
				onEdit={ onTaxRateEdit } />;
		}

		return row;
	}

	renderTableHeading( text, tooltip ) {
		return (
			<th>
				{ text.replace( ' ', '\u00A0' ) }&nbsp;<Helptip text={ tooltip } />
			</th>
		);
	}

	render() {
		const { taxRates, i18n, onSave } = this.props;

		return (
			<div>
				<table className="wc_tax_rates wc_input_table sortable widefat">
					<thead>
						<tr>
							<th className="sort">&nbsp;</th>
							{ this.renderTableHeading( i18n.country_code, i18n.country_code_hint ) }
							{ this.renderTableHeading( i18n.state_code, i18n.state_code_hint ) }
							{ this.renderTableHeading( i18n.postcode, i18n.postcode_hint ) }
							{ this.renderTableHeading( i18n.city, i18n.city_hint ) }
							{ this.renderTableHeading( i18n.rate, i18n.rate_hint ) }
							{ this.renderTableHeading( i18n.tax_name, i18n.tax_name_hint ) }
							{ this.renderTableHeading( i18n.priority, i18n.priority_hint ) }
							{ this.renderTableHeading( i18n.compound, i18n.compound_hint ) }
							{ this.renderTableHeading( i18n.shipping, i18n.shipping_hint ) }
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

				<Button primary disabled={ false } onClick={ onSave } >{ i18n.save_changes }</Button>
			</div>
		);
	}
}
