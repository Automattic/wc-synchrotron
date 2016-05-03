import React, { PropTypes } from 'react';

export default class Helptip extends React.Component {
	propTypes: {
		text: React.PropTypes.string.isRequired
	}
	render() {
		return (
			<span className="synchrotron-help-tip" data-tip={this.props.text}></span>
		);
	}
}
