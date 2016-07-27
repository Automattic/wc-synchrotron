import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import RootChild from 'components/root-child';
import debug from 'debug';

const log = debug( 'synchrotron:react-popover' );

export default class Popover extends React.Component {
	propTypes: {
	}

	getContextRect() {
		const { context } = this.props;

		if ( context instanceof Element ) {
			return context.getBoundingClientRect();
		} else {
			return context;
		}

	}

	render() {
		const rect = this.getContextRect();

		if ( rect && this.props.isVisible ) {
			const divStyle = {
				position: 'absolute',
				top: rect.top + 'px',
				left: rect.left + 'px',
			};

			return (
				<RootChild>
					<div style={ divStyle } >
						{ this.props.children }
					</div>
				</RootChild>
			);
		} else {
			return null;
		}
	}
}

