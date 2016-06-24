import React from 'react';
import { localize } from 'i18n-calypso';
import Notice from 'components/notice';
import NoticeAction from 'components/notice/notice-action';

class AdminNotices extends React.Component {

	constructor( props ) {
		super( props );

		this.viewClicked = this.viewClicked.bind( this );

		this.state = {
			content: '',
			hidden: true
		};
	}

	componentWillMount() {
		const noticeList = document.getElementById( 'admin-notice-list' );

		this.setState( Object.assign( {}, { noticeList } ) );
	}

	viewClicked( evt ) {
		const { hide } = this.state;

		evt.preventDefault();

		this.setHidden( !this.state.hidden );
	}

	setHidden( hidden ) {

		if ( hidden ) {
			this.state.noticeList.setAttribute( 'style', 'display:none;' );
		} else {
			this.state.noticeList.setAttribute( 'style', '' );
		}

		this.setState( Object.assign( {}, { hidden } ) );
	}

	render() {
		const __ = this.props.translate;
		const { hidden } = this.state;

		return (
			<div>
				<Notice
					status="is-info"
					icon="notice"
					showDismiss={ false }
					text={ __( 'There are WordPress notices need your attention' ) }
					className="wordpress-notices"
				>
					<NoticeAction href="#" external={ false } onClick={ this.viewClicked }>
						{ hidden ? __( 'View' ) : __( 'Hide' ) }
					</NoticeAction>
				</Notice>
			</div>
		);
	}
}

export default localize( AdminNotices );
