import React, { PropTypes } from 'react';

export default class TitleBar extends React.Component {
	propTypes: {
		title: PropTypes.string.isRequired,
		tagLine: PropTypes.element.isRequired,
	}

	constructor( props ) {
		super( props );
	}

	render() {
		const { title, tagLine } = this.props;

		return (
			<div className="title-bar">
				<div className="title">
					<h1>{ title }</h1>
					<span className="title-tagline">
						{ tagLine }
					</span>
				</div>
				<div className="title-sidebar">
					{ this.props.children }
				</div>
			</div>
		);
	}
}

