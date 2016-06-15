import React from 'react'
import Nav from './nav';

export default function App( { children } ) {
  return (
	<div className="frame" >
		<Nav className='navigation' />
		<div className="screen">
			{ children }
		</div>
	</div>
  )
}
