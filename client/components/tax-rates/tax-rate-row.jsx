import React, { PropTypes } from 'react';

export default class TaxRateRow extends React.Component {
	onChange( id, field, value ) {
		this.props.onChange( id, field, value );
	}
	render() {
		let i18n = WCSTaxRatesArgs.i18n;
		let { id, country, state, postcode, city, rate, name, priority, compound, apply_to_shipping } = this.props.data;
		return (
			<tr data-tip={ i18n.tax_rate_id + ": " + id }>
				<td className="sort"></td>
				<td className="country">
					<input type="text" placeholder="*" value={ country } onChange={ ( e ) => { this.onChange( id, 'country', e.target.value ); } } />
				</td>
				<td className="state">
					<input type="text" placeholder="*" value={ state } onChange={ ( e ) => { this.onChange( id, 'state', e.target.value ); } } />
				</td>
				<td className="postcode">
					<input type="text" placeholder="*" value={ postcode } onChange={ ( e ) => { this.onChange( id, 'postcode', e.target.value ); } } />
				</td>
				<td className="city">
					<input type="text" placeholder="*" value={ city } onChange={ ( e ) => { this.onChange( id, 'city', e.target.value ); } } />
				</td>
				<td className="rate">
					<input type="number" step="any" min="0" placeholder="0" value={ rate } onChange={ ( e ) => { this.onChange( id, 'rate', e.target.value ); } } />
				</td>
				<td className="name">
					<input type="text" value={ name } onChange={ ( e ) => { this.onChange( id, 'name', e.target.value ); } } />
				</td>
				<td className="priority">
					<input type="number" step="1" min="1" value={ priority } onChange={ ( e ) => { this.onChange( id, 'priority', e.target.value ); } } />
				</td>
				<td className="compound">
					<input type="checkbox" className="checkbox" value={ compound } onChange={ ( e ) => { this.onChange( id, 'compound', e.target.value ); } } />
				</td>
				<td className="apply_to_shipping">
					<input type="checkbox" className="checkbox" value={ apply_to_shipping } onChange={ ( e ) => { this.onChange( id, 'apply_to_shipping', e.target.value ); } } />
				</td>
			</tr>
	   );
   }
}
