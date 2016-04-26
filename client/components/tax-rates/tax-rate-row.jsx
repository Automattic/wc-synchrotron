import React, { PropTypes } from 'react';

export default class TaxRateRow extends React.Component {
	propTypes: {
		data   : PropTypes.object.isRequired,
		taxRate: PropTypes.object.isRequired,
		onEdit : PropTypes.func.isRequired,
	}

	constructor( props ) {
		super( props );

		this.onChange = this.onChange.bind( this );
	}

	onChange( e ) {
		const { taxRate, onEdit } = this.props;

		onEdit( taxRate, e.target.name, e.target.value );
	}

	render() {
		const { taxRate, data } = this.props;
		const { id, country, state, postcode, city, rate, name, priority, compound, apply_to_shipping } = taxRate;
		let i18n = data.strings;

		return (
			<tr data-tip={ i18n.tax_rate_id + ": " + id }>
				<td className="sort"></td>
				<td className="country">
					<input type="text" placeholder="*" name="country" value={ country } onChange={ this.onChange } />
				</td>
				<td className="state">
					<input type="text" placeholder="*" name="state" value={ state } onChange={ this.onChange } />
				</td>
				<td className="postcode">
					<input type="text" placeholder="*" name="postcode" value={ postcode } onChange={ this.onChange } />
				</td>
				<td className="city">
					<input type="text" placeholder="*" name="city" value={ city } onChange={ this.onChange } />
				</td>
				<td className="rate">
					<input type="number" step="any" min="0" placeholder="0" name="rate" value={ rate } onChange={ this.onChange } />
				</td>
				<td className="name">
					<input type="text" name="name" value={ name } onChange={ this.onChange } />
				</td>
				<td className="priority">
					<input type="number" step="1" min="1" name="priority" value={ priority } onChange={ this.onChange } />
				</td>
				<td className="compound">
					<input type="checkbox" className="checkbox" name="compound" value={ compound } onChange={ this.onChange } />
				</td>
				<td className="apply_to_shipping">
					<input type="checkbox" className="checkbox" name="apply_to_shipping" value={ apply_to_shipping } onChange={ this.onChange } />
				</td>
			</tr>
	   );
   }
}
