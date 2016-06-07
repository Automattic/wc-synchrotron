import React from 'react'
import Nav from './nav';

export default function App( { children } ) {
  return (
	<div className="frame" >
		<Nav />
		<div id="screen" className="wc-admin-screen">
			{ children }
		</div>
	</div>
  )
}
