import React from 'react'
import { Link } from 'react-router'
import Nav from './nav';

export default function App( { children } ) {
  return (
	<div className="frame" >
		<div id="navigation" className="wc-admin-navigation">
			<Nav />
		</div>
		<div id="screen" className="wc-admin-screen">
			<header>
				Links:
				{' '}
				<Link to="/">Home</Link>
				{' '}
				<Link to="/coupons">Coupons</Link>
				{' '}
				<Link to="/taxes">Taxes</Link>
			</header>
			{children}
		</div>
	</div>
  )
}
